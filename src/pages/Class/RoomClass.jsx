// RoomClass.jsx
import React, { useState } from "react";
import "./RoomClass.css";

const RoomClass = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: "Meeting Room A", capacity: 10 },
    { id: 2, name: "Meeting Room B", capacity: 20 },
  ]);

  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleAddRoom = (e) => {
    e.preventDefault();

    if (!roomName.trim() || !capacity) {
      alert("Mohon lengkapi semua field");
      return;
    }

    if (Number(capacity) < 1) {
      alert("Kapasitas minimal 1 orang");
      return;
    }

    const newRoom = {
      id: Date.now(),
      name: roomName.trim(),
      capacity: Number(capacity),
    };

    setRooms([...rooms, newRoom]);
    setRoomName("");
    setCapacity("");
  };

  const handleDetail = (room) => {
    alert(`${room.name}\nKapasitas: ${room.capacity} orang`);
  };

  return (
    <div className="room-container">
      {/* Form Tambah Room */}
      <div className="card form-card">
        <form onSubmit={handleAddRoom}>
          <div className="form-row">
            <div className="form-group">
              <label>Nama Room</label>
              <input
                type="text"
                placeholder="Masukkan nama room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Kapasitas</label>
              <input
                type="number"
                placeholder="Masukkan kapasitas"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="1"
              />
            </div>
            <div className="form-group">

            <button type="submit" className="btn-add">
              Tambah Room
            </button>
            </div>
          </div>
        </form>
      </div>

      {/* List Room */}
      <div className="room-list">
        <h2>Daftar Room</h2>

        <div className="room-grid">
          {rooms.map((room) => (
            <div className="card room-card" key={room.id}>
              <h3>{room.name}</h3>
              <p>Kapasitas: {room.capacity} orang</p>

              <button 
                className="btn-detail"
                onClick={() => handleDetail(room)}
              >
                Detail
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomClass;