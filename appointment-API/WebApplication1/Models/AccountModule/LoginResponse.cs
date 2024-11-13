namespace WebApplication1.Models.AccountModule
{
    public class LoginResponse
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        /// <summary>
        /// 1 => Admin
        /// 2 => User
        /// </summary>
        public int Type { get; set; }
        public int StatusCode { get; set; }
        public string Message { get; set; }
    }
}
