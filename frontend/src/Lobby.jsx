import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Lobby() {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    item: '',
    income: '',
    expense: '',
    note: '',
  });

  useEffect(() => {
    axios.get('http://localhost:3001/records')
      .then((res) => setRecords(res.data))
      .catch((err) => console.error('Error fetching records:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const income = formData.income ? parseFloat(formData.income) : null;
    const expense = formData.expense ? parseFloat(formData.expense) : null;
    const total = income ? income : expense ? -expense : 0;

    try {
      await axios.post('http://localhost:3001/records', {
        item: formData.item,
        income,
        expense,
        note: formData.note,
        total,
      });
      setFormData({ item: '', income: '', expense: '', note: '' });
      setShowModal(false);
      const res = await axios.get('http://localhost:3001/records');
      setRecords(res.data);
    } catch (err) {
      console.error('Error adding record:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold text-center">Welcome to Futiger</h1>

      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          ➕ เพิ่มรายการ
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2">ลำดับ</th>
              <th className="px-4 py-2">รายการ</th>
              <th className="px-4 py-2">รายรับ</th>
              <th className="px-4 py-2">รายจ่าย</th>
              <th className="px-4 py-2">หมายเหตุ</th>
              <th className="px-4 py-2">รวมยอด</th>
              <th className="px-4 py-2 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record, index) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{record.item}</td>
                <td className="px-4 py-2 text-green-600">{record.income ?? '-'}</td>
                <td className="px-4 py-2 text-red-600">{record.expense ?? '-'}</td>
                <td className="px-4 py-2">{record.note ?? '-'}</td>
                <td className="px-4 py-2 font-semibold">{record.total}</td>
                <td className="px-4 py-2 text-center">
                  <Link to={`/edit/${record.id}`} className="text-blue-600 hover:underline">แก้ไข</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-lg font-semibold mb-4">เพิ่มรายการใหม่</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="รายการ"
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="รายรับ"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="รายจ่าย"
                value={formData.expense}
                onChange={(e) => setFormData({ ...formData, expense: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="หมายเหตุ"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
