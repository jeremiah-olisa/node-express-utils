type CustomHttpResponse<TData, TMeta> = {
  success: boolean;
  message: string;
  data: TData;
} & TMeta;

export default CustomHttpResponse;
