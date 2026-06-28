import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import DoctorToolbar from "../../components/admin/DoctorToolbar";
import DoctorTable from "../../components/admin/DoctorTable";
import AddDoctorDialog from "../../components/admin/AddDoctorDialog";
import DoctorProfileDialog from "../../components/admin/DoctorProfileDialog";
import EditDoctorDialog from "../../components/admin/EditDoctorDialog";
import DeleteDoctorDialog from "../../components/admin/DeleteDoctorDialog";
import { getDoctors } from "../../services/doctorService";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadDoctors = async () => {
    try {
      const res = await getDoctors();

      console.log("Full API Response:", res);
      console.log("Doctors Data:", res.data);

      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setDoctors([]);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      await loadDoctors();
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) =>
    (doctor.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DoctorToolbar
          search={search}
          setSearch={setSearch}
          setOpen={setOpen}
          doctorCount={doctors.length}
        />

        <DoctorTable
          doctors={filteredDoctors}
          onView={(doctor) => {
            setSelectedDoctor(doctor);
            setViewOpen(true);
          }}
          onEdit={(doctor) => {
            setSelectedDoctor(doctor);
            setEditOpen(true);
          }}
          onDelete={(doctor) => {
            setSelectedDoctor(doctor);
            setDeleteOpen(true);
          }}
          onRevoke={(doctor) => {
            console.log("Revoke Doctor", doctor);
          }}
        />

        <AddDoctorDialog
          open={open}
          setOpen={setOpen}
          refreshDoctors={loadDoctors}
        />

        {/* These dialogs will be added in the next steps */}

        {
          <DoctorProfileDialog
            open={viewOpen}
            setOpen={setViewOpen}
            doctor={selectedDoctor}
          />
        }

        {
          <EditDoctorDialog
            open={editOpen}
            setOpen={setEditOpen}
            doctor={selectedDoctor}
            refreshDoctors={loadDoctors}
          />
        }

        {
          <DeleteDoctorDialog
            open={deleteOpen}
            setOpen={setDeleteOpen}
            doctor={selectedDoctor}
            refreshDoctors={loadDoctors}
          />
        }
      </div>
    </DashboardLayout>
  );
}

export default Doctors;
