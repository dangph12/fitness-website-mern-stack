export interface ApiResponseType<T = unknown> {
  status: 'success' | 'failed' | 'error';
  message: string;
  data?: T;
}

const ApiResponse = {
  success<T>(message: string, data?: T): ApiResponseType<T> {
    return {
      status: 'success',
      message,
      data
    };
  },

  failed(message: string): ApiResponseType<undefined> {
    return {
      status: 'failed',
      message
    };
  },

  error(message: string): ApiResponseType<undefined> {
    return {
      status: 'error',
      message
    };
  }
};

export default ApiResponse;
