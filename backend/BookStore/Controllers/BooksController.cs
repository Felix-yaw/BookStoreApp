using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BookStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var result = await _bookService.GetAllAsync();
            if (!result.Success)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _bookService.GetByIdAsync(id);
            if (!result.Success)
                return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BookDto dto)
        {
            var result = await _bookService.AddAsync(dto);
            if (!result.Success)
                return BadRequest(result);
            return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BookDto dto)
        {
            if (id != dto.Id)
                return BadRequest(Result<bool>.FailureResult("Mismatched ID."));

            var result = await _bookService.UpdateAsync(dto);
            if (!result.Success)
                return NotFound(result);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _bookService.DeleteAsync(id);
            if (!result.Success)
                return NotFound(result);
            return Ok(result);
        }
    }
}
