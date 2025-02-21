using ims.core.Interfaces;
using ims.core.Services;
using IMS.data.data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ✅ Read Configuration
var configuration = builder.Configuration;
var connectionString = configuration.GetConnectionString("DefaultConnection");
var googleClientId = configuration["GoogleAuth:ClientId"];
var googleClientSecret = configuration["GoogleAuth:ClientSecret"];
var secretKey = configuration["JwtSettings:SecretKey"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// ✅ Ensure Required Configurations Exist
if (string.IsNullOrEmpty(connectionString))
    throw new Exception("Database connection string is missing!");

if (string.IsNullOrEmpty(secretKey) || secretKey.Length < 32)
    throw new Exception("JWT Secret Key must be at least 32 characters long.");

// ✅ Register Database Context (EF Core - SQL Server)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// ✅ Register Services (Dependency Injection)
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<JwtService>();

// ✅ Enable Cookie Authentication for OAuth
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme; // ✅ Fix: Default scheme is Cookie
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie() // ✅ Required for OAuth state tracking
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
})
.AddGoogle(googleOptions =>
{
    googleOptions.ClientId = googleClientId;
    googleOptions.ClientSecret = googleClientSecret;
    googleOptions.CallbackPath = "/api/auth/google-callback"; // ✅ Ensure this matches Google Console
    googleOptions.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme; // ✅ Use Cookies for Google OAuth
});

// ✅ Add Session Management (Required for OAuth)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Session Timeout
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/api/auth/google-login";
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(10);
});

// ✅ Add API Controllers
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = null; // ✅ Ensures correct JSON format
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("AllowAll");

// ✅ Enable Swagger UI in Development Mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Apply Middleware
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();
app.UseCookiePolicy(); // ✅ Fix OAuth state tracking

// ✅ Map API Controllers
app.MapControllers();

// ✅ Run the Application
app.Run();
