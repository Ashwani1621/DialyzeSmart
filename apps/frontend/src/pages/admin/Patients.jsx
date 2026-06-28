import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import PatientToolbar from "../../components/admin/PatientToolbar";
import PatientTable from "../../components/admin/PatientTable";
import AddPatientDialog from "../../components/admin/AddPatientDialog";
import PatientProfileDialog from "../../components/admin/PatientProfileDialog";
import EditPatientDialog from "../../components/admin/EditPatientDialog";
import DeletePatientDialog from "../../components/admin/DeletePatientDialog";
import AssignDoctorDialog from "../../components/admin/AssignDoctorDialog";

import { getPatients } from "../../services/patientService";

function Patients() {
  const [patients, setPatients] = useState([]);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [profileOpen, setProfileOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);

  const loadPatients = async () => {
    try {
      const res = await getPatients();

      if (Array.isArray(res.data)) {
        setPatients(res.data);
      } else {
        setPatients([]);
      }
    } catch (err) {
      console.error(err);

      setPatients([]);
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      await loadPatients();
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    (patient.patientName ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PatientToolbar
          search={search}
          setSearch={setSearch}
          setOpen={setOpen}
          patientCount={patients.length}
        />

        <PatientTable
          patients={filteredPatients}
          onView={(patient) => {
            setSelectedPatient(patient);
            setProfileOpen(true);
          }}
          onEdit={(patient) => {
            setSelectedPatient(patient);
            setEditOpen(true);
          }}
          onDelete={(patient) => {
            setSelectedPatient(patient);
            setDeleteOpen(true);
          }}
          onAssign={(patient) => {
            setSelectedPatient(patient);
            setAssignOpen(true);
          }}
        />

        <AddPatientDialog
          open={open}
          setOpen={setOpen}
          refreshPatients={loadPatients}
        />

        <PatientProfileDialog
          open={profileOpen}
          setOpen={setProfileOpen}
          patient={selectedPatient}
          refreshPatient={loadPatients}
        />

        <EditPatientDialog
          open={editOpen}
          setOpen={setEditOpen}
          patient={selectedPatient}
          refreshPatients={loadPatients}
        />

        <DeletePatientDialog
          open={deleteOpen}
          setOpen={setDeleteOpen}
          patient={selectedPatient}
          refreshPatients={loadPatients}
        />

        <AssignDoctorDialog
          open={assignOpen}
          setOpen={setAssignOpen}
          patient={selectedPatient}
          refreshPatients={loadPatients}
        />
      </div>
    </DashboardLayout>
  );
}

export default Patients;
