using Application.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICategoryService
    {
        Task<Result<IEnumerable<CategoryDto>>> GetAllAsync();
        Task<Result<CategoryDto>> GetByIdAsync(int id);
        Task<Result<CategoryDto>> AddAsync(CategoryDto categoryDto);
        Task<Result<bool>> UpdateAsync(CategoryDto categoryDto);
        Task<Result<bool>> DeleteAsync(int id);
    }
}
