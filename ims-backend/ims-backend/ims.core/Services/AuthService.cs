using ims.core.Interfaces;
using ims.data.Models;
using IMS.data.data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ims.core.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthService(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<User?> RegisterUserAsync(string username, string email, string password, string role = "Employee")
        {
            if (await _context.Users.AnyAsync(u => u.Email == email))
                return null; // Email already exists

            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = password != null ? HashPassword(password) : "", // Handle null password for Google users
                Role = role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<string?> LoginUserAsync(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || (password != null && !VerifyPassword(password, user.PasswordHash)))
                return null; // Invalid credentials

            return _jwtService.GenerateToken(user);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<string> GenerateTokenAsync(User user)
        {
            return _jwtService.GenerateToken(user);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            return HashPassword(password) == storedHash;
        }
    }
}
