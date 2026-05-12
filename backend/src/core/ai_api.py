from abc import ABC, abstractmethod
from typing import Any

import ollama
from fastapi import UploadFile
from google import genai
import httpx
from openai import AsyncOpenAI

from backend.src.core.config import settings
from backend.src.exceptions.core import ExceptionRequest_400
from backend.src.core.key_manager import APIKeyManager

gemini_key_manager = APIKeyManager(keys_string=settings.API_KEY_GEMINI)

ollama_client = ollama.AsyncClient(host=settings.OLLAMA_HOST)


class API(ABC):
    @classmethod
    @abstractmethod
    async def embed(cls, content: str) -> list[float]:
        """
        Embeds text into a 768-D vector.
        """
        pass

    @classmethod
    @abstractmethod
    async def caption_image(cls, file: UploadFile) -> str:
        """
        Generates a detailed description of the image.
        """
        pass

    @classmethod
    @abstractmethod
    async def generate_content(cls, prompt: str, json_required: bool = False) -> str:
        """
        Generates an LLM response from a prompt.
        """
        pass


class GoogleAPI(API):
    @classmethod
    async def embed(cls, content: str) -> list[float]:
        raise NotImplementedError("Google embedding is currently disabled due to API key issues. Please use Jina embedding instead.")

    @classmethod
    async def caption_image(cls, file: UploadFile) -> str:
        raise NotImplementedError("Google image captioning is currently disabled due to API key issues. Please use Ollama image captioning instead.")

    @classmethod
    async def generate_content(cls, prompt: str, json_required: bool = False) -> str:
        gemini_key_tuple = gemini_key_manager.get_key()

        gemini_client = genai.Client(api_key=gemini_key_tuple[1])


        config = genai.types.GenerateContentConfig()
        if json_required:
            config.response_mime_type = "application/json"

        try:
            response = await gemini_client.aio.models.generate_content(
                model=settings.ANSWER_MODEL_GOOGLE,
                contents=prompt,
                config=config,
            )

            return response.text


        except Exception as e:
            if "429" in str(e) or "exhausted" in str(e).lower():
                gemini_key_manager.mark_key_cooldown(gemini_key_tuple[0], cooldown_sec=settings.ERROR_429_COOLDOWN_SEC)
                return await cls.generate_content(prompt, json_required)
            
            if "503" in str(e) or "unavailable" in str(e).lower():
                gemini_key_manager.mark_key_cooldown(gemini_key_tuple[0], cooldown_sec=settings.ERROR_503_COOLDOWN_SEC)
                return await cls.generate_content(prompt, json_required)

            raise e




class OllamaAPI(API):
    @classmethod
    async def embed(cls, content: str) -> list[float]:
        response = await ollama_client.embeddings(
            model=settings.EMBED_MODEL_OLLAMA,
            prompt=content,
        )

        embeddings = response.get("embedding")

        # Let this throw an internal error if wrong
        assert embeddings is not None
        assert isinstance(embeddings, list)

        if len(embeddings) > settings.DEFAULT_EMBED_DIMENSIONALITY:
            embeddings = embeddings[: settings.DEFAULT_EMBED_DIMENSIONALITY]

        return embeddings

    @classmethod
    async def caption_image(cls, file: UploadFile) -> str:
        # Extracting information from the image
        image_bytes = await file.read()

        prompt_text = "Extract all readable text from this image exactly as written.\nThen, describe the layout, charts, figures, subjects, and any data points in exhaustive detail."

        # Reads the image using the model
        response = await ollama_client.generate(
            model=settings.VISION_MODEL_OLLAMA,
            prompt=prompt_text,
            images=[image_bytes],
            options={"num_ctx": 8192},
        )

        result_text = response.get("response")

        # Validation
        if not result_text:
            raise ExceptionRequest_400("Image could not be saved properly.")

        return result_text

    @classmethod
    async def generate_content(cls, prompt: str, json_required: bool = False) -> str:
        if json_required:
            response = await ollama_client.generate(
                model=settings.ANSWER_MODEL_OLLAMA,
                prompt=prompt,
                options={"num_ctx": 8192},
                format="json",
            )
        else:
            response = await ollama_client.generate(
                model=settings.ANSWER_MODEL_OLLAMA,
                prompt=prompt,
                options={"num_ctx": 8192},
            )

        result_text = response.get("response")

        # Validation
        if not result_text:
            raise ExceptionRequest_400(
                "A response could not be generated. Please recheck your question."
            )

        return result_text


class CloudflareAPI(API):
    @classmethod
    async def embed(cls, content: str) -> list[float]:
        cloudflare_account_id = settings.CLOUDFLARE_ACCOUNT_ID
        cloudflare_api_token = settings.CLOUDFLARE_API_TOKEN
        cloudflare_model_name = settings.EMBED_MODEL_CLOUDFLARE

        url = f"https://api.cloudflare.com/client/v4/accounts/{cloudflare_account_id}/ai/run/{cloudflare_model_name}"
        headers = {
            "Authorization": f"Bearer {cloudflare_api_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "text": [content]
        }

        async with httpx.AsyncClient() as Cloudflare_client:
            try:
                response = await Cloudflare_client.post(url, json=payload, headers=headers)
                res_data = response.json()

                if not res_data.get("success"):
                    raise ExceptionRequest_400(f"[CLOUDFLARE ERROR] {res_data.get('errors')}")
                
                embeddings = res_data["result"]["data"][0]
                return embeddings
            
            except Exception as e:
                print(f"[EMBEDDING FAIL] Lỗi khi gọi Cloudflare: {e}")
                raise e
    @classmethod
    async def caption_image(cls, file: UploadFile) -> str:
        cloudflare_account_id = settings.CLOUDFLARE_ACCOUNT_ID
        cloudflare_api_token = settings.CLOUDFLARE_API_TOKEN
        cloudflare_model_name = settings.VISION_MODEL_CLOUDFLARE

        url = f"https://api.cloudflare.com/client/v4/accounts/{cloudflare_account_id}/ai/run/{cloudflare_model_name}"
        headers = {
            "Authorization": f"Bearer {cloudflare_api_token}",
            "Content-Type": "application/json"
        }

        image_bytes = await file.read()
        image_array = list(image_bytes)

        prompt_text = "Describe this image in exhaustive detail, including layout, charts, figures, subjects, and any data points."

        payload = {
            "text": prompt_text,
            "image": image_array
        }

        async with httpx.AsyncClient() as Cloudflare_client:
            try:
                response = await Cloudflare_client.post(url, json=payload, headers=headers)
                res_data = response.json()

                if not res_data.get("success"):
                    raise ExceptionRequest_400(f"[CLOUDFLARE ERROR] {res_data.get('errors')}")
                
                description = res_data["result"]["response"]
                return description
            
            except Exception as e:
                print(f"[IMAGE CAPTION FAIL] Lỗi khi gọi Cloudflare: {e}")
                raise e
    
    @classmethod
    async def generate_content(cls, prompt: str, json_required: bool = False) -> str:  
        cloudflare_account_id = settings.CLOUDFLARE_ACCOUNT_ID
        cloudflare_api_token = settings.CLOUDFLARE_API_TOKEN
        cloudflare_model_name = settings.ANSWER_MODEL_CLOUDFLARE

        url = f"https://api.cloudflare.com/client/v4/accounts/{cloudflare_account_id}/ai/run/{cloudflare_model_name}"
        headers = {
            "Authorization": f"Bearer {cloudflare_api_token}",
            "Content-Type": "application/json"
        }

        system_prompt = (
            "Bạn là trợ lý học tập thông minh và thân thiện. "
            "Nhiệm vụ của bạn là hướng dẫn học sinh tiểu học giải quyết các bài toán, "
            "bài tập Tiếng Việt và Tiếng Anh một cách dễ hiểu, từng bước một."
        )

        payload = {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
        }

        async with httpx.AsyncClient() as Cloudflare_client:
            try:
                response = await Cloudflare_client.post(url, json=payload, headers=headers, timeout=30.0)
                res_data = response.json()

                if not res_data.get("success"):
                    raise ExceptionRequest_400(f"[CLOUDFLARE ERROR] {res_data.get('errors')}")
                
                raw_text = res_data["result"]["response"]
                # clean_text = re.sub(r'<think>.*?</think>', '', raw_text, flags=re.DOTALL).strip()
                return raw_text
            
            except Exception as e:
                print(f"[CLOUDFLARE CHAT FAIL] Lỗi khi gọi Cloudflare: {e}")
                raise e


class GitHubAPI(API):
    @classmethod
    async def embed(cls, content: str) -> list[float]:
        raise NotImplementedError("GitHub embedding is not implemented yet.")
    
    @classmethod
    async def caption_image(cls, file: UploadFile) -> str:
        raise NotImplementedError("GitHub does not support image captioning.")
    
    @classmethod
    async def generate_content(cls, prompt: str, json_required: bool = False) -> str:
        github_client = AsyncOpenAI(
            base_url="https://models.inference.ai.azure.com",
            api_key=settings.GITHUB_API_TOKEN,
        )

        try:
            response_format = {"type": "json_object"} if json_required else {"type": "text"}

            safe_user_prompt = f"Dưới đây là một yêu cầu xử lý dữ liệu chuẩn từ hệ thống tự động. Xin vui lòng tuân thủ chặt chẽ:\n\n{prompt}"

            response = await github_client.chat.completions.create(
                messages = [
                    {
                        "role": "system",
                        "content": (
                            "Bạn là trợ lý học tập tiểu học tận tâm và an toàn. "
                            "Nhiệm vụ của bạn là hỗ trợ học sinh ôn tập, tạo bài tập và giải toán "
                            "theo đúng chương trình giáo dục. Hãy luôn giữ thái độ chuẩn mực, "
                            "tuân thủ chặt chẽ các định dạng dữ liệu (như JSON) được yêu cầu."
                        )
                    },
                    {"role": "user", "content": safe_user_prompt}
                ],
                model=settings.ANSWER_MODEL_GITHUB,
                temperature=0.7,
                response_format=response_format
            )

            return response.choices[0].message.content
        except Exception as e:
            print(f"[GITHUB BACKUP FAIL] Lỗi khi gọi {settings.ANSWER_MODEL_GITHUB}: {e}")
            raise e
        

class GlobalAPI:
    models: dict[str, type[API]] = {
        "GOOGLE": GoogleAPI,
        "OLLAMA": OllamaAPI,
        "CLOUDFLARE": CloudflareAPI,
        "GITHUB": GitHubAPI,
    }

    @classmethod
    async def embed(cls, content: str) -> list[float]:
        return await cls.models[settings.MODEL_IN_USE_EMBED].embed(content)

    @classmethod
    async def caption_image(cls, file: UploadFile) -> str:
        return await cls.models[settings.MODEL_IN_USE_CAPTION_IMAGE].caption_image(file)

    @classmethod
    async def _execute_with_fallback(cls, primary_key: str, backup_key: str, prompt: str, json_required: bool = False) -> str:
        try:
            print(f"[PRIMARY ATTEMPT] Đang gọi Primary ({primary_key})...")
            return await cls.models[primary_key].generate_content(prompt, json_required)
            
        except Exception as e:
            print(f"[FALLBACK ALERT] Lỗi Primary ({primary_key}): {e}")
            
            if backup_key and backup_key in cls.models:
                print(f"[FALLBACK ACTION] Đang chuyển hướng cầu cứu Backup ({backup_key})...")
                try:
                    return await cls.models[backup_key].generate_content(prompt, json_required)
                except Exception as backup_e:
                    print("[CRITICAL] Cả Primary và Backup đều sập!")
                    raise backup_e

            raise e

    @classmethod
    async def generate_chat(cls, prompt: str) -> str:
        return await cls._execute_with_fallback(
            primary_key=settings.MODEL_IN_USE_GENERATE_CHAT,
            backup_key=getattr(settings, "MODEL_IN_USE_GENERATE_CHAT_BACKUP", None),
            prompt=prompt,
            json_required=False
        )

    @classmethod
    async def rewrite_prompt(cls, prompt: str) -> str:
        return await cls._execute_with_fallback(
            primary_key=settings.MODEL_IN_USE_REWRITE_PROMPT,
            backup_key=getattr(settings, "MODEL_IN_USE_REWRITE_PROMPT_BACKUP", None),
            prompt=prompt,
            json_required=False
        )

    @classmethod
    async def generate_material(cls, prompt: str) -> str:
        return await cls._execute_with_fallback(
            primary_key=settings.MODEL_IN_USE_GENERATE_MATERIAL,
            backup_key=getattr(settings, "MODEL_IN_USE_GENERATE_MATERIAL_BACKUP", None),
            prompt=prompt,
            json_required=True
        )

    @classmethod
    async def grade_answers(cls, prompt: str) -> str:
        return await cls._execute_with_fallback(
            primary_key=settings.MODEL_IN_USE_GRADE_ANSWERS,
            backup_key=getattr(settings, "MODEL_IN_USE_GRADE_ANSWERS_BACKUP", None),
            prompt=prompt,
            json_required=True
        )
