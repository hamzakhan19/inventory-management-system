using ims.core.Interfaces;

using ims.data.Models;
using IMS.data.data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ims.core.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetProductsAsync() =>
            await _context.Products.ToListAsync();

        public async Task<Product?> GetProductByIdAsync(int id) =>
            await _context.Products.FindAsync(id);

        public async Task<Product> AddProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Product?> UpdateProductAsync(int id, Product updatedProduct)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
                return null; 

            
            existingProduct.Name = updatedProduct.Name;
            existingProduct.SKU = updatedProduct.SKU;
            existingProduct.Category = updatedProduct.Category;
            existingProduct.Quantity = updatedProduct.Quantity;
            existingProduct.Price = updatedProduct.Price;

            await _context.SaveChangesAsync();
            return existingProduct;
        }
    }
}
