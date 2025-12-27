export const successResponse = (data: any, message = "Success", meta?: any) => ({
  success: true,
  message,
  data,
  meta,
});
