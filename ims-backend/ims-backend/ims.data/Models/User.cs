using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ims.data.Models
{
    public class User
    {
        [Key] // Primary Key
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty; // Hashed password storage

        [Required, MaxLength(20)]
        public string Role { get; set; } = "Employee"; // Default role: Employee
    }
}
