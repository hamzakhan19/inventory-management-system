using ims.core.Interfaces;
using ims.data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ims.api.Controllers
{
    [Route("api/products")]
    [ApiController]

    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return Ok(await _productService.GetProductsAsync());
        }

        [HttpPost]

        public async Task<ActionResult<Product>> AddProduct([FromBody] Product product)
        {
            return Ok(await _productService.AddProductAsync(product));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] Product product)
        {
            var updatedProduct = await _productService.UpdateProductAsync(id, product);
            if (updatedProduct == null)
                return NotFound("Product not found"); // ✅ Return 404 if product does not exist

            return Ok(updatedProduct);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            Console.WriteLine($"🔹 Received DELETE request for ID: {id}"); // ✅ Log incoming request

            bool deleted = await _productService.DeleteProductAsync(id);

            if (!deleted)
            {
                Console.WriteLine("❌ Product not found!");
                return NotFound("Product not found");
            }

            Console.WriteLine("✅ Product deleted successfully!");
            return NoContent();
        }
    }
}
