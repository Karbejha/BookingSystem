namespace WebApplication1.Models.AccountModule
{
    public class ResetPasswordRequest
    {
        public required string UserName { get; set; }
        public required string NewPassword { get; set; }
    }
}