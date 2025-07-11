using Application.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IBookService
    {
        Task<Result<IEnumerable<BookDto>>> GetAllAsync();
        Task<Result<BookDto>> GetByIdAsync(int id);
        Task<Result<BookDto>> AddAsync(BookDto bookDto);
        Task<Result<bool>> UpdateAsync(BookDto bookDto);
        Task<Result<bool>> DeleteAsync(int id);
    }
}
