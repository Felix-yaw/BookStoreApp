namespace Application.Dtos
{
    public class Result<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }

        public Result(bool success, string message, T data = default)
        {
            Success = success;
            Message = message;
            Data = data;
        }

        public static Result<T> SuccessResult(T data, string message = "Operation successful.")
            => new Result<T>(true, message, data);

        public static Result<T> FailureResult(string message)
            => new Result<T>(false, message);
    }
}
