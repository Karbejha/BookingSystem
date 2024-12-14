using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models.AccountModule;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        [HttpPost(Name = "Login")]
        public async Task<LoginResponse> Login(LoginRequest oModel)
        {
            AccountCOM accountCOM = new AccountCOM();
            LoginResponse response =await accountCOM.Login(oModel);
            return response;
        }
        [HttpPost(Name = "Signup")]
        public async Task<SignupResponse> Signup(SignupRequest oModel)
        //[HttpPost]
        //[Route("api/[controller]/[Action]")]
        //public async Task<SignupResponse> Signup([FromBody] SignupRequest oModel)
        {
            AccountCOM accountCOM = new AccountCOM();
            SignupResponse response = await accountCOM.Signup(oModel);
            return response;
        }
        [HttpGet(Name = "GetUserDetails")]
        public async Task<UserDetailsResponse> GetUserDetails(int UserID)
        {
            AccountCOM accountCOM = new AccountCOM();
            UserDetailsResponse response = await accountCOM.GetUserDetails(UserID);
            return response;
        }
        [HttpPut(Name = "UpdateUserProfile")]
        public async Task<UserDetailsResponse> UpdateUserProfile([FromBody] UserUpdateRequest oModel, [FromQuery] int UserID)
        {
            AccountCOM accountCOM = new AccountCOM();
            UserDetailsResponse response = await accountCOM.UpdateUserProfile(UserID, oModel);
            return response;
        }
    };
    

};
