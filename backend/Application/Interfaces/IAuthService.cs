using System.Threading.Tasks;
using Application.Dtos.Auth;
using Application.Dtos;

namespace Application.Interfaces
{
    public interface IAuthService
    {
        Task<Result<AuthResponseDto>> RegisterAsync(RegisterRequestDto model);
        Task<Result<AuthResponseDto>> LoginAsync(LoginRequestDto model);
    }
}
