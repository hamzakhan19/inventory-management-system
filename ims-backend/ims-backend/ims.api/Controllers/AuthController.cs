using ims.core.Interfaces;
using ims.data.Models;
using ims.api.DTOs;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ims.api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto request)
        {
            var user = await _authService.RegisterUserAsync(request.Username, request.Email, request.Password, "Employee"); // Default role: Employee
            if (user == null) return BadRequest("User with this email already exists.");

            return Ok(new { message = "User registered successfully!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto request)
        {
            var token = await _authService.LoginUserAsync(request.Email, request.Password);
            if (token == null) return Unauthorized("Invalid credentials.");

            return Ok(new { token });
        }

        [HttpGet("google-login")]
        public IActionResult GoogleLogin()
        {
            var redirectUrl = Url.Action(nameof(GoogleCallback), "Auth", null, Request.Scheme); // ✅ Fix: Ensure Absolute URL
            var properties = new AuthenticationProperties
            {
                RedirectUri = redirectUrl,
                AllowRefresh = true,
                IsPersistent = true
            };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded || authenticateResult.Principal == null)
                return BadRequest("Google authentication failed.");

            var email = authenticateResult.Principal.FindFirst(ClaimTypes.Email)?.Value;
            var username = authenticateResult.Principal.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(username))
                return BadRequest("Google authentication failed to retrieve user info.");

            // Check if user exists, otherwise create one
            var user = await _authService.RegisterUserAsync(username, email, null); // No password for Google users
            if (user == null) return BadRequest("User creation failed.");

            // Generate JWT Token
            var token = await _authService.LoginUserAsync(email, null);

            return Ok(new { token });
        }
    }
}
