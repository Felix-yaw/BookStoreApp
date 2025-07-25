﻿using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Repositories
{
    public class BookRepository : IBookRepository
    {
            private readonly BookStoreDbContext _context;

            public BookRepository(BookStoreDbContext context)
            {
                _context = context;
            }

            public async Task<IEnumerable<Book>> GetAllAsync()
            {
                return await _context.Books
                    .Include(b => b.Category)
                    .ToListAsync();
            }

            public async Task<Book?> GetByIdAsync(int id)
            {
                return await _context.Books
                    .Include(b => b.Category)
                    .FirstOrDefaultAsync(b => b.Id == id);
            }

            public async Task AddAsync(Book book)
            {
                await _context.Books.AddAsync(book);
                await _context.SaveChangesAsync();
            }

            public async Task UpdateAsync(Book book)
            {
                _context.Books.Update(book);
                await _context.SaveChangesAsync();
            }

            public async Task DeleteAsync(int id)
            {
                var book = await _context.Books.FindAsync(id);
                if (book != null)
                {
                    _context.Books.Remove(book);
                    await _context.SaveChangesAsync();
                }
            }
        
    }
}
