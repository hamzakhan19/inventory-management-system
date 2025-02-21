using Microsoft.AspNetCore.Mvc;
using ims.core.Interfaces;
using ims.data.Models;

namespace ims.api.Controllers
{
    [Route("api/inventory")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpPost("stock-in")]
        public IActionResult StockIn([FromBody] StockRequest request)
        {
            var result = _inventoryService.StockIn(request.ProductId, request.Quantity);
            if (!result) return BadRequest(new { message = "Stock update failed." });

            return Ok(new { message = "Stock added successfully!" });
        }

        [HttpPost("stock-out")]
        public IActionResult StockOut([FromBody] StockRequest request)
        {
            var result = _inventoryService.StockOut(request.ProductId, request.Quantity);
            if (!result) return BadRequest(new { message = "Stock reduction failed." });

            return Ok(new { message = "Stock reduced successfully!" });
        }
    }

    public class StockRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
