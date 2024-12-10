namespace WebApplication1.Models.AccountModule
{
    public class SignupResponse
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public int Type { get; set; }
        public bool IsActive { get; set; }
        public int StatusCode { get; set; }
        public string Message { get; set; }
    }
}
