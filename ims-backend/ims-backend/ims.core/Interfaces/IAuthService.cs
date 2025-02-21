using ims.data.Models;
using System.Threading.Tasks;

namespace ims.core.Interfaces
{
    public interface IAuthService
    {
        Task<User?> RegisterUserAsync(string username, string email, string password, string role = "Employee");
        Task<string?> LoginUserAsync(string email, string password);
        Task<User?> GetUserByEmailAsync(string email); 
        Task<string> GenerateTokenAsync(User user);
    }
}