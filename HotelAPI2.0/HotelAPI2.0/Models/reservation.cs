using System.ComponentModel.DataAnnotations.Schema;

namespace HotelAPI2._0.Models
{
    [Table("reservation")]
    public class Reservation
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("guest")]
        public int GuestId { get; set; }

        [Column("room")]
        public int RoomId { get; set; }

        [Column("start_date")]
        public DateTime StartDate { get; set; }

        [Column("end_date")]
        public DateTime EndDate { get; set; }

        [Column("employee")]
        public int EmployeeId { get; set; }
    }
}
