namespace WebApplication1.Models.AccountModule
{
    public class UserUpdateRequest
    {
        public int ID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }
}