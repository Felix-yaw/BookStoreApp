namespace Application.Dtos.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }
}
