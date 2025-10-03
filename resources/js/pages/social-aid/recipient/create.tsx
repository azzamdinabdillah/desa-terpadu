import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import ConfirmationModal from '@/components/ConfirmationModal';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { CitizenType } from '@/types/citizen/citizenType';
import { FamilyType } from '@/types/familyType';
import { SocialAidProgram } from '@/types/socialAid/socialAidTypes';
import { router, usePage } from '@inertiajs/react';
import { Minus, Plus, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateRecipientPageProps {
    programs: SocialAidProgram[];
    citizens: CitizenType[];
    families: FamilyType[];
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

interface RecipientForm {
    id: string;
    citizen_id?: number;
    family_id?: number;
    note?: string;
}

function CreateRecipientPage() {
    const { programs, citizens, families, flash } = usePage<CreateRecipientPageProps>().props;
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<string>('');
    const [recipients, setRecipients] = useState<RecipientForm[]>([{ id: '1', citizen_id: undefined, family_id: undefined, note: '' }]);
    const [showProgramChangeModal, setShowProgramChangeModal] = useState(false);
    const [pendingProgramId, setPendingProgramId] = useState<string>('');

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    // Get selected program details
    const selectedProgramData = programs.find((p) => p.id.toString() === selectedProgram);    

    // Prepare program options
    const programOptions = programs.map((program) => ({
        value: program.id.toString(),
        label: `${program.program_name} (${program.period})`,
    }));

    // Check if there are any recipients with data
    const hasRecipientsWithData = recipients.some(
        (recipient) => recipient.citizen_id || recipient.family_id || (recipient.note && recipient.note.trim() !== ''),
    );

    // Handle program change
    const handleProgramChange = (newProgramId: string) => {
        if (hasRecipientsWithData && newProgramId !== selectedProgram) {
            setPendingProgramId(newProgramId);
            setShowProgramChangeModal(true);
        } else {
            setSelectedProgram(newProgramId);
        }
    };

    // Confirm program change
    const handleConfirmProgramChange = () => {
        setSelectedProgram(pendingProgramId);
        setRecipients([{ id: '1', citizen_id: undefined, family_id: undefined, note: '' }]);
        setShowProgramChangeModal(false);
        setPendingProgramId('');
    };

    // Cancel program change
    const handleCancelProgramChange = () => {
        setShowProgramChangeModal(false);
        setPendingProgramId('');
    };

    const addRecipient = () => {
        const newId = (recipients.length + 1).toString();
        setRecipients([
            ...recipients,
            {
                id: newId,
                citizen_id: undefined,
                family_id: undefined,
                note: '',
            },
        ]);
    };

    const removeRecipient = (id: string) => {
        if (recipients.length > 1) {
            setRecipients(recipients.filter((recipient) => recipient.id !== id));
        }
    };

    // Get recipient name for duplicate check
    const getRecipientName = (recipient: RecipientForm) => {
        if (recipient.citizen_id) {
            const citizen = citizens.find((c) => c.id === recipient.citizen_id);
            return citizen ? citizen.full_name : 'Warga tidak ditemukan';
        }
        if (recipient.family_id) {
            const family = families.find((f) => f.id === recipient.family_id);
            return family ? family.family_name : 'Keluarga tidak ditemukan';
        }
        return 'Belum dipilih';
    };

    const updateRecipient = (id: string, field: keyof RecipientForm, value: any) => {
        // Check for duplicates when selecting citizen or family
        if (field === 'citizen_id' && value) {
            const duplicateRecipient = recipients.find((recipient) => recipient.id !== id && recipient.citizen_id === value);
            if (duplicateRecipient) {
                const duplicateName = getRecipientName(duplicateRecipient);
                setAlert({
                    type: 'error',
                    message: `Warga ini sudah dipilih sebagai penerima bantuan (${duplicateName}). Pilih warga lain.`,
                });
                return;
            }
        }

        if (field === 'family_id' && value) {
            const duplicateRecipient = recipients.find((recipient) => recipient.id !== id && recipient.family_id === value);
            if (duplicateRecipient) {
                const duplicateName = getRecipientName(duplicateRecipient);
                setAlert({
                    type: 'error',
                    message: `Keluarga ini sudah dipilih sebagai penerima bantuan (${duplicateName}). Pilih keluarga lain.`,
                });
                return;
            }
        }

        setRecipients(recipients.map((recipient) => (recipient.id === id ? { ...recipient, [field]: value } : recipient)));
    };

    const handleSubmit = () => {
        if (!selectedProgram) {
            setAlert({ type: 'error', message: 'Pilih program bantuan sosial terlebih dahulu' });
            return;
        }

        const validRecipients = recipients.filter((recipient) => recipient.citizen_id || recipient.family_id);

        if (validRecipients.length === 0) {
            setAlert({ type: 'error', message: 'Minimal pilih satu penerima bantuan' });
            return;
        }

        // Check for duplicates in valid recipients
        const citizenIds = validRecipients.map((r) => r.citizen_id).filter(Boolean);
        const familyIds = validRecipients.map((r) => r.family_id).filter(Boolean);

        const duplicateCitizens = citizenIds.filter((id, index) => citizenIds.indexOf(id) !== index);
        const duplicateFamilies = familyIds.filter((id, index) => familyIds.indexOf(id) !== index);

        if (duplicateCitizens.length > 0) {
            setAlert({ type: 'error', message: 'Terdapat warga yang dipilih lebih dari sekali. Periksa kembali daftar penerima.' });
            return;
        }

        if (duplicateFamilies.length > 0) {
            setAlert({ type: 'error', message: 'Terdapat keluarga yang dipilih lebih dari sekali. Periksa kembali daftar penerima.' });
            return;
        }

        // TODO: Implement store functionality
        console.log('Selected Program:', selectedProgram);
        console.log('Recipients:', validRecipients);

        setAlert({ type: 'success', message: 'Fitur store akan diimplementasikan nanti' });
    };

    return (
        <BaseLayouts>
            <div>
                <Header title="Tambah Penerima Bantuan Sosial" icon="🤝" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} errors={alert.errors} />}

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage title="Tambah Penerima Bantuan Sosial" description="Pilih program dan tambahkan penerima bantuan sosial" />

                    <div className="space-y-6">
                        {/* Program Selection */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-green-900">Pilih Program Bantuan Sosial</h3>
                            <Select
                                label="Program Bantuan Sosial"
                                options={programOptions}
                                value={selectedProgram}
                                onChange={handleProgramChange}
                                placeholder="Pilih program bantuan sosial"
                                required
                            />
                            {selectedProgram && selectedProgramData && (
                                <div className="mt-3 rounded-lg bg-green-50 p-3">
                                    <p className="text-sm text-green-700">
                                        Program: <span className="font-medium">{selectedProgramData.program_name}</span>
                                    </p>
                                    <p className="text-xs text-green-600">
                                        Tipe: {selectedProgramData.type === 'individual' ? 'Individu' : 'Keluarga'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Recipients Section */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-green-900">Penerima Bantuan Sosial</h3>
                                {selectedProgram && (
                                    <Button
                                        onClick={addRecipient}
                                        variant="outline"
                                        icon={<Plus className="h-4 w-4" />}
                                        iconPosition="left"
                                        size="sm"
                                    >
                                        Tambah Penerima
                                    </Button>
                                )}
                            </div>

                            {!selectedProgram ? (
                                <div className="rounded-lg bg-gray-50 p-6 text-center">
                                    <p className="text-gray-600">Pilih program bantuan sosial terlebih dahulu untuk menambah penerima</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recipients.map((recipient, index) => (
                                        <div key={recipient.id} className="rounded-lg border border-green-100 bg-green-50 p-4">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h4 className="font-medium text-green-900">Penerima #{index + 1}</h4>
                                                {recipients.length > 1 && (
                                                    <Button
                                                        onClick={() => removeRecipient(recipient.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {/* Citizen Selection - Show if program type is individual */}
                                                {selectedProgramData?.type === 'individual' && (
                                                    <div className="md:col-span-2">
                                                        <Select
                                                            label="Pilih Warga"
                                                            options={citizens.map((citizen) => {
                                                                const isSelected = recipients.some(
                                                                    (r) => r.id !== recipient.id && r.citizen_id === citizen.id,
                                                                );
                                                                
                                                                return {
                                                                    value: citizen.id.toString(),
                                                                    label: `${citizen.full_name} (${citizen.nik})${isSelected ? ' - Sudah dipilih' : ''}`,
                                                                    disabled: isSelected,
                                                                };
                                                            })}
                                                            value={recipient.citizen_id?.toString() || ''}
                                                            onChange={(value) =>
                                                                updateRecipient(recipient.id, 'citizen_id', value ? parseInt(value) : undefined)
                                                            }
                                                            placeholder="Pilih warga"
                                                            enableSearch={true}
                                                            searchPlaceholder="Cari warga..."
                                                        />
                                                    </div>
                                                )}

                                                {/* Family Selection - Show if program type is household */}
                                                {selectedProgramData?.type === 'household' && (
                                                    <div className="md:col-span-2">
                                                        <Select
                                                            label="Pilih Keluarga"
                                                            options={families.map((family) => {
                                                                const isSelected = recipients.some(
                                                                    (r) => r.id !== recipient.id && r.family_id === family.id,
                                                                );
                                                                return {
                                                                    value: family.id.toString(),
                                                                    label: `${family.family_name} (${family.kk_number || 'No KK'})${isSelected ? ' - Sudah dipilih' : ''}`,
                                                                    disabled: isSelected,
                                                                };
                                                            })}
                                                            value={recipient.family_id?.toString() || ''}
                                                            onChange={(value) =>
                                                                updateRecipient(recipient.id, 'family_id', value ? parseInt(value) : undefined)
                                                            }
                                                            placeholder="Pilih keluarga"
                                                            enableSearch={true}
                                                            searchPlaceholder="Cari keluarga..."
                                                        />
                                                    </div>
                                                )}

                                                {/* Note */}
                                                <div className="md:col-span-2">
                                                    <label className="mb-2 block text-sm font-medium text-green-900">Catatan (Opsional)</label>
                                                    <InputField
                                                        type="text"
                                                        placeholder="Catatan untuk penerima ini..."
                                                        value={recipient.note || ''}
                                                        onChange={(value) => updateRecipient(recipient.id, 'note', value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <Button
                                onClick={() => router.visit('/social-aid/recipients')}
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Button>
                            <Button onClick={handleSubmit} icon={<UserCheck className="h-4 w-4" />} iconPosition="left">
                                Simpan Penerima
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Program Change Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showProgramChangeModal}
                    onClose={handleCancelProgramChange}
                    onConfirm={handleConfirmProgramChange}
                    title="Ganti Program Bantuan Sosial"
                    message={
                        <div>
                            <p className="mb-2">Apakah Anda yakin ingin mengganti program bantuan sosial?</p>
                            <p className="text-sm text-gray-600">
                                Semua penerima bantuan yang sudah ditambahkan akan dihapus dan Anda harus memilih penerima baru.
                            </p>
                        </div>
                    }
                    confirmText="Ya, Ganti Program"
                    cancelText="Batal"
                />
            </div>
        </BaseLayouts>
    );
}

export default CreateRecipientPage;
