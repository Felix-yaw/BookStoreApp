using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class BookStoreDbContext : IdentityDbContext<User>
    {
        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }

        public BookStoreDbContext(DbContextOptions<BookStoreDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Book>(entity =>
            {
                entity.ToTable("Books");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Books)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("Categories");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
            });
        }
    }
}
