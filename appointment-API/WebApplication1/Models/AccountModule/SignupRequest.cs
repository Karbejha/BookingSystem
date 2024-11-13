namespace WebApplication1.Models.AccountModule
{
    public class SignupRequest
    {
        public string UserName { get; set; }
        public required string Password { get; set; }
        public required string Email { get; set; }
        public int Type { get; set; }
        public int StatusCode { get; set; }
        public string Message { get; set; }
    }
}
