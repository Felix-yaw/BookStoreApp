using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<Result<IEnumerable<CategoryDto>>> GetAllAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            var categoryDtos = categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name
            });
            return Result<IEnumerable<CategoryDto>>.SuccessResult(categoryDtos, "Categories retrieved successfully.");
        }

        public async Task<Result<CategoryDto>> GetByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                return Result<CategoryDto>.FailureResult("Category not found.");

            var categoryDto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };

            return Result<CategoryDto>.SuccessResult(categoryDto, "Category retrieved successfully.");
        }

        public async Task<Result<CategoryDto>> AddAsync(CategoryDto categoryDto)
        {
            var category = new Category
            {
                Name = categoryDto.Name
            };

            await _categoryRepository.AddAsync(category);

            var resultDto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };

            return Result<CategoryDto>.SuccessResult(resultDto, "Category added successfully.");
        }

        public async Task<Result<bool>> UpdateAsync(CategoryDto categoryDto)
        {
            var category = await _categoryRepository.GetByIdAsync(categoryDto.Id);
            if (category == null)
                return Result<bool>.FailureResult("Category not found.");

            category.Name = categoryDto.Name;
            await _categoryRepository.UpdateAsync(category);

            return Result<bool>.SuccessResult(true, "Category updated successfully.");
        }

        public async Task<Result<bool>> DeleteAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                return Result<bool>.FailureResult("Category not found.");

            await _categoryRepository.DeleteAsync(id);
            return Result<bool>.SuccessResult(true, "Category deleted successfully.");
        }
    }
}
