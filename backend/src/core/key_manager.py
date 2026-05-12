import time
import random

from backend.src.exceptions.core import ExceptionRequest_400

class APIKeyManager:
    def __init__(self, keys_string: str):
        self.keys = {}
        
        if keys_string:
            raw_keys = [key.strip() for key in keys_string.split(",") if key.strip()]

            for index, key in enumerate(raw_keys):
                self.keys[index] = {
                    "api_key": key,
                    "cooldown_until": 0,  # Timestamp when the key can be used again
                }
    
    def get_key(self) -> str:
        if not self.keys:
            raise Exception("No API keys available.")

        current_time = time.time()
        available_keys = []

        for key_name, key_info in self.keys.items():
            if current_time > key_info["cooldown_until"]:
                available_keys.append((key_name, key_info["api_key"]))

        if not available_keys:
            raise ExceptionRequest_400("All API keys are currently on cooldown. Please try again later.")

        return random.choice(available_keys)
    

    def mark_key_cooldown(self, key_name: str, cooldown_sec: int = None):
        penalty_time = cooldown_sec if cooldown_sec is not None else self.cooldown_sec
        cooldown_time = time.time() + penalty_time
        self.keys[key_name]["cooldown_until"] = cooldown_time
        