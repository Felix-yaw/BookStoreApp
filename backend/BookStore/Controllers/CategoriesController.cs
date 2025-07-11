using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BookStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllAsync();
            if (!result.Success)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _categoryService.GetByIdAsync(id);
            if (!result.Success)
                return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryDto dto)
        {
            var result = await _categoryService.AddAsync(dto);
            if (!result.Success)
                return BadRequest(result);
            return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryDto dto)
        {
            if (id != dto.Id)
                return BadRequest(Result<bool>.FailureResult("Mismatched ID."));

            var result = await _categoryService.UpdateAsync(dto);
            if (!result.Success)
                return NotFound(result);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _categoryService.DeleteAsync(id);
            if (!result.Success)
                return NotFound(result);
            return Ok(result);
        }
    }
}
