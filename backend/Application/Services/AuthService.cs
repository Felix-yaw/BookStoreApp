using Application.Dtos.Auth;
using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Linq;

namespace Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;

        public AuthService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<Result<AuthResponseDto>> RegisterAsync(RegisterRequestDto model)
        {
            var user = new User
            {
                UserName = model.UserName,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                return Result<AuthResponseDto>.FailureResult($"Registration failed: {errors}");
            }

            var authResponse = await GenerateAuthResponse(user);
            return Result<AuthResponseDto>.SuccessResult(authResponse, "Registration successful.");
        }

        public async Task<Result<AuthResponseDto>> LoginAsync(LoginRequestDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Result<AuthResponseDto>.FailureResult("Invalid email or password.");

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!isPasswordValid)
                return Result<AuthResponseDto>.FailureResult("Invalid email or password.");

            var authResponse = await GenerateAuthResponse(user);
            return Result<AuthResponseDto>.SuccessResult(authResponse, "Login successful.");
        }

        private async Task<AuthResponseDto> GenerateAuthResponse(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
            var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
            var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");

            if (string.IsNullOrWhiteSpace(jwtKey) || string.IsNullOrWhiteSpace(jwtIssuer) || string.IsNullOrWhiteSpace(jwtAudience))
                throw new Exception("JWT environment variables are not set.");

            var key = Encoding.UTF8.GetBytes(jwtKey);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(6),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtIssuer,
                Audience = jwtAudience,
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new AuthResponseDto
            {
                Token = tokenHandler.WriteToken(token),
                UserId = user.Id,
                UserName = user.UserName,
                Email = user.Email
            };
        }
    }
}
