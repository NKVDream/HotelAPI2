using HotelAPI2._0.Data;
using HotelAPI2._0.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelAPI2._0.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservationsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            return await _context.Reservations.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> GetReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null) return NotFound();
            return reservation;
        }

        [HttpPost]
        [HttpPost]
        public async Task<ActionResult<Reservation>> PostReservation(Reservation reservation)
        {
            Console.WriteLine($"Создание резервации: GuestId={reservation.GuestId}, RoomId={reservation.RoomId}, EmployeeId={reservation.EmployeeId}");
            Console.WriteLine($"Даты: Start={reservation.StartDate}, End={reservation.EndDate}, Kind={reservation.StartDate.Kind}");

            // Обнуляем Id
            reservation.Id = 0;

            // ✅ ФИКС: Убедимся что даты в правильном формате для PostgreSQL
            // PostgreSQL с включенным LegacyTimestampBehavior принимает Unspecified
            if (reservation.StartDate.Kind == DateTimeKind.Local)
            {
                reservation.StartDate = DateTime.SpecifyKind(reservation.StartDate, DateTimeKind.Unspecified);
            }
            if (reservation.EndDate.Kind == DateTimeKind.Local)
            {
                reservation.EndDate = DateTime.SpecifyKind(reservation.EndDate, DateTimeKind.Unspecified);
            }

            Console.WriteLine($"Даты после конвертации: Start={reservation.StartDate}, End={reservation.EndDate}, Kind={reservation.StartDate.Kind}");

            // Проверяем существование объектов
            var guestExists = await _context.Guests.AnyAsync(g => g.Id == reservation.GuestId);
            var roomExists = await _context.Rooms.AnyAsync(r => r.Id == reservation.RoomId);
            var employeeExists = await _context.Employees.AnyAsync(e => e.Id == reservation.EmployeeId);

            if (!guestExists) return BadRequest("Гость не найден");
            if (!roomExists) return BadRequest("Комната не найдена");
            if (!employeeExists) return BadRequest("Сотрудник не найден");

            // Проверяем даты
            if (reservation.EndDate <= reservation.StartDate)
                return BadRequest("Дата выезда должна быть позже даты заезда");

            try
            {
                _context.Reservations.Add(reservation);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ Резервация создана с ID: {reservation.Id}");
                return CreatedAtAction("GetReservation", new { id = reservation.Id }, reservation);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 Ошибка сохранения: {ex.Message}");
                Console.WriteLine($"💥 StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"Ошибка сервера: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservation(int id, Reservation reservation)
        {
            if (id != reservation.Id) return BadRequest();

            _context.Entry(reservation).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null) return NotFound();

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
