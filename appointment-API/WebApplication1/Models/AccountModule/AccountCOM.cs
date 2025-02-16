using Microsoft.EntityFrameworkCore;
using WebApplication1.Models.Database;
using MySql.Data.MySqlClient;

// using this for hashing password
using Microsoft.AspNetCore.Identity;


namespace WebApplication1.Models.AccountModule
{
    public class AccountCOM
    {
        private readonly PasswordHasher<User> _passwordHasher = new PasswordHasher<User>();
        public async Task<SignupResponse> Signup(SignupRequest oModel)
        {
            SignupResponse response = new SignupResponse();
            try
            {
                using (AppointmentdbContext db = new AppointmentdbContext())
                {
                    bool userExist = await db.Users.AnyAsync(u => u.Email == oModel.Email);
                    if (userExist)
                    {
                        response.StatusCode = 409;
                        response.Message = "Email or Username already exist";
                        return response;
                    }
                    else
                    {
                        User newUser = new User()
                        {
                            Email = oModel.Email,
                            FullName = oModel.FullName,
                            Username = oModel.UserName,
                            IsActive = 1,
                            Type = 2,
                            CreatedAt = DateTime.Now,
                        };

                        // Hash the password
                        newUser.Password = _passwordHasher.HashPassword(newUser, oModel.Password);

                        db.Users.Add(newUser);
                        await db.SaveChangesAsync();

                        response.UserID = newUser.Id;
                        response.UserName = oModel.UserName;
                        response.FullName = oModel.FullName;
                        response.Email = oModel.Email;
                        response.Type = newUser.Type;
                        response.IsActive = true;
                        response.StatusCode = 201;
                        response.Message = "User created successfully";
                    }
                }
            }
            catch (Exception e)
            {
                response.StatusCode = 500;
                response.Message = "An error occurred while creating the user.";
            }
            return response;
        }

        public async Task<LoginResponse> Login(LoginRequest oModel)
        {
            LoginResponse response = new LoginResponse();
            using (AppointmentdbContext db = new AppointmentdbContext())
            {
                User oUser = await db.Users.FirstOrDefaultAsync(x => x.Username == oModel.UserName);
                if (oUser != null)
                {
                    // Verify the password
                    var verificationResult = _passwordHasher.VerifyHashedPassword(oUser, oUser.Password, oModel.Password);
                    if (verificationResult == PasswordVerificationResult.Success)
                    {
                        if (oUser.IsActive == 1)
                        {
                            response.UserID = oUser.Id;
                            response.UserName = oUser.Username;
                            response.Email = oUser.Email;
                            response.Type = oUser.Type;
                            response.IsActive = true;
                            response.StatusCode = 200;
                            response.Message = "Success";
                        }
                        else
                        {
                            response.StatusCode = 403;
                            response.Message = "Your account is blocked";
                        }
                    }
                    else
                    {
                        response.StatusCode = 401;
                        response.Message = "Invalid username or password";
                    }
                }
                else
                {
                    response.StatusCode = 401;
                    response.Message = "Your account does not exist";
                }
            }
            return response;
        }


        public async Task<UserDetailsResponse> GetUserDetails(int UserID)
        {
            UserDetailsResponse response = new UserDetailsResponse();
            using (AppointmentdbContext db = new AppointmentdbContext())
            {
                User oUser = await db.Users.Where(x => x.Id == UserID).FirstOrDefaultAsync();
                if (oUser != null && oUser.Id > 0)
                {
                    response.UserID = oUser.Id;
                    response.UserName = oUser.Username; 
                    response.FullName = oUser.FullName;
                    response.Email = oUser.Email;
                    response.Type = oUser.Type;
                    response.Address =oUser.Address;
                    response.Phone = oUser.Phone;
                    response.IsActive = true;
                    response.StatusCode = 200;
                    response.Message = "Success";
                }
                else
                {
                    response.StatusCode = 401;
                    response.Message = "Your account is not exist";
                }
            }
            return response;
        }
        public async Task<UserDetailsResponse> UpdateUserProfile(int userId, UserUpdateRequest oModel)
        {
            UserDetailsResponse response = new UserDetailsResponse();
            try
            {
                using (AppointmentdbContext db = new AppointmentdbContext())
                {
                    var user = await db.Users.FirstOrDefaultAsync(x => x.Id == userId);

                    if (user != null)
                    {
                        // Update user fields
                        user.FullName = oModel.FullName;
                        user.Email = oModel.Email;
                        user.Phone = oModel.Phone;
                        user.Address = oModel.Address;

                        await db.SaveChangesAsync();

                        // Prepare response
                        response.UserID = user.Id;
                        response.UserName = user.Username;
                        response.FullName = user.FullName;
                        response.Email = user.Email;
                        response.Phone = user.Phone;
                        response.Address = user.Address;
                        response.Type = user.Type;
                        response.IsActive = true;
                        response.StatusCode = 200;
                        response.Message = "Profile updated successfully";
                    }
                    else
                    {
                        response.StatusCode = 404;
                        response.Message = "User not found";
                    }
                }
            }
            catch (Exception ex)
            {
                response.StatusCode = 500;
                response.Message = "An error occurred while updating the profile.";
            }
            return response;
        }

        public async Task<bool> ResetPassword(ResetPasswordRequest model)
        {
            try
            {
                using (AppointmentdbContext db = new AppointmentdbContext())
                {
                    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
                    if (user != null)
                    {
                        user.Password = _passwordHasher.HashPassword(user, model.NewPassword);
                        await db.SaveChangesAsync();
                        return true;
                    }
                }
            }
            catch (Exception)
            {
                // Log exception
            }
            return false;
        }
    }
};