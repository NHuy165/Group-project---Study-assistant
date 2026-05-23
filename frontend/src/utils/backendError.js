export const parseBackendError = (error) => {
    const status = error?.response?.status;
    const exceptionType = error?.response?.data?.exception_type;
    const backendMessage = error?.response?.data?.message;

    return {
        status,
        exceptionType,
        backendMessage,
        rawError: error,
    };
};

export const logBackendError = (scope, parsedError, options = {}) => {
    if (!parsedError) return;

    const { isDeveloperFix = false } = options;
    const { status, exceptionType, backendMessage, rawError } = parsedError;

    if (isDeveloperFix) {
        console.error(
        `[${scope}] Backend error (needs dev fix):`,
        {
            status,
            exceptionType,
            backendMessage,
        },
        rawError,
        );
        return;
    }

    console.warn(`[${scope}] Backend error:`, {
        status,
        exceptionType,
        backendMessage,
    });
};