using Application.Dtos.Auth;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.Dtos;

namespace BookStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAuthService _authServices;

        public AccountController(IAuthService authService)
        {
            _authService = authService;
        }



        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (!result.Success)
                return Unauthorized(result);

            return Ok(result);
        }
    }
}
