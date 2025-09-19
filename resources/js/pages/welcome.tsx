import { Head } from '@inertiajs/react';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Container,
    DropdownMenu,
    Flex,
    Grid,
    Heading,
    IconButton,
    Separator,
    Text,
    TextField,
} from '@radix-ui/themes';
import {
    Activity,
    BarChart3,
    Bell,
    Building2,
    Calendar,
    ChevronRight,
    FileText,
    Home,
    MapIcon,
    MapPin,
    Menu,
    Plus,
    Search,
    Settings,
    Shield,
    Sprout,
    TreePine,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

// Dummy user data
const users = [
    {
        id: 1,
        name: 'Budi Santoso',
        email: 'budi@desa.id',
        role: 'Kepala Desa',
        status: 'active',
        avatar: 'BS',
        lastActive: '2 menit lalu',
        department: 'Pemerintahan',
    },
    {
        id: 2,
        name: 'Siti Aminah',
        email: 'siti@desa.id',
        role: 'Sekretaris',
        status: 'active',
        avatar: 'SA',
        lastActive: '15 menit lalu',
        department: 'Administrasi',
    },
    {
        id: 3,
        name: 'Ahmad Wijaya',
        email: 'ahmad@desa.id',
        role: 'Bendahara',
        status: 'inactive',
        avatar: 'AW',
        lastActive: '2 hari lalu',
        department: 'Keuangan',
    },
    {
        id: 4,
        name: 'Dewi Lestari',
        email: 'dewi@desa.id',
        role: 'Staff',
        status: 'active',
        avatar: 'DL',
        lastActive: '1 jam lalu',
        department: 'Pelayanan',
    },
    {
        id: 5,
        name: 'Rudi Hartono',
        email: 'rudi@desa.id',
        role: 'Staff',
        status: 'active',
        avatar: 'RH',
        lastActive: '30 menit lalu',
        department: 'Teknis',
    },
];

// Dashboard stats
const dashboardStats = [
    { title: 'Total Penduduk', value: '2,847', change: '+12', icon: <Users className="h-6 w-6" />, color: 'bg-blue-500', trend: 'up' },
    { title: 'Keluarga Aktif', value: '1,234', change: '+5', icon: <UserCheck className="h-6 w-6" />, color: 'bg-green-500', trend: 'up' },
    { title: 'Lahan Pertanian', value: '456 Ha', change: '-2', icon: <Sprout className="h-6 w-6" />, color: 'bg-yellow-500', trend: 'down' },
    { title: 'Laporan Bulan Ini', value: '89', change: '+23', icon: <FileText className="h-6 w-6" />, color: 'bg-purple-500', trend: 'up' },
];

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    subItems?: MenuItem[];
    badge?: string;
}

const menuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <Home size={20} />,
    },
    {
        id: 'penduduk',
        label: 'Kependudukan',
        icon: <Users size={20} />,
        badge: '2,847',
        subItems: [
            { id: 'data-penduduk', label: 'Data Penduduk', icon: <Users size={16} /> },
            { id: 'kartu-keluarga', label: 'Kartu Keluarga', icon: <Shield size={16} /> },
            { id: 'kelahiran', label: 'Kelahiran', icon: <Activity size={16} /> },
            { id: 'kematian', label: 'Kematian', icon: <Calendar size={16} /> },
        ],
    },
    {
        id: 'wilayah',
        label: 'Wilayah Desa',
        icon: <MapIcon size={20} />,
        subItems: [
            { id: 'peta-desa', label: 'Peta Desa', icon: <MapPin size={16} /> },
            { id: 'batas-wilayah', label: 'Batas Wilayah', icon: <Building2 size={16} /> },
            { id: 'rt-rw', label: 'Data RT/RW', icon: <Home size={16} /> },
        ],
    },
    {
        id: 'laporan',
        label: 'Laporan',
        icon: <BarChart3 size={20} />,
        badge: '12',
    },
];

export default function Welcome() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['penduduk']);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleMenu = (menuId: string) => {
        setExpandedMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]));
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.department.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const SidebarContent = () => (
        <Box className="h-full border-r border-slate-200 bg-white shadow-sm">
            {/* Logo/Header */}
            <Box className="border-b border-slate-100 p-6">
                <Flex align="center" gap="3">
                    <Box className="relative">
                        <Box className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 shadow-lg">
                            <TreePine size={28} className="text-white" />
                        </Box>
                        <Box className="absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-green-400"></Box>
                    </Box>
                    <Box>
                        <Text size="5" weight="bold" className="leading-tight text-slate-800">
                            Desa Terpadu
                        </Text>
                        <Text size="2" className="font-medium text-slate-500">
                            Sistem Manajemen Digital
                        </Text>
                    </Box>
                </Flex>
            </Box>

            {/* User Profile */}
            <Box className="border-b border-slate-100 p-4">
                <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
                    <Flex align="center" gap="3">
                        <Avatar fallback="AD" size="3" className="bg-emerald-600 shadow-md" />
                        <Box className="flex-1">
                            <Text size="3" weight="bold" className="text-emerald-800">
                                Admin Desa
                            </Text>
                            <Text size="1" className="text-emerald-600">
                                Kepala Administrator
                            </Text>
                        </Box>
                        <IconButton variant="ghost" size="1" className="text-emerald-600">
                            <Settings size={16} />
                        </IconButton>
                    </Flex>
                </Card>
            </Box>

            {/* Navigation Menu */}
            <Box className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <div key={item.id}>
                            <Button
                                variant="ghost"
                                className={`h-auto w-full justify-start rounded-xl p-3 transition-all duration-200 ${
                                    item.id === 'dashboard'
                                        ? 'border border-emerald-200 bg-emerald-100 text-emerald-800 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                                onClick={() => item.subItems && toggleMenu(item.id)}
                            >
                                <Flex align="center" justify="between" width="100%">
                                    <Flex align="center" gap="3">
                                        <Box className={`rounded-lg p-1.5 ${item.id === 'dashboard' ? 'bg-emerald-200' : 'bg-slate-100'}`}>
                                            {item.icon}
                                        </Box>
                                        <Text size="3" weight="medium">
                                            {item.label}
                                        </Text>
                                    </Flex>
                                    <Flex align="center" gap="2">
                                        {item.badge && (
                                            <Badge variant="soft" className="bg-emerald-100 px-2 text-xs text-emerald-700">
                                                {item.badge}
                                            </Badge>
                                        )}
                                        {item.subItems && (
                                            <Box
                                                className={`transition-transform duration-200 ${expandedMenus.includes(item.id) ? 'rotate-90' : ''}`}
                                            >
                                                <ChevronRight size={16} />
                                            </Box>
                                        )}
                                    </Flex>
                                </Flex>
                            </Button>

                            {/* Submenu */}
                            {item.subItems && expandedMenus.includes(item.id) && (
                                <Box className="mt-2 ml-4 space-y-1 border-l-2 border-slate-100 pl-4">
                                    {item.subItems.map((subItem) => (
                                        <Button
                                            key={subItem.id}
                                            variant="ghost"
                                            className="h-auto w-full justify-start rounded-lg p-2.5 text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-700"
                                        >
                                            <Flex align="center" gap="2.5">
                                                <Box className="rounded bg-slate-50 p-1">{subItem.icon}</Box>
                                                <Text size="2" weight="medium">
                                                    {subItem.label}
                                                </Text>
                                            </Flex>
                                        </Button>
                                    ))}
                                </Box>
                            )}
                        </div>
                    ))}
                </nav>
            </Box>
        </Box>
    );

    return (
        <>
            <Head>
                <title>Dashboard - Manajemen Desa Terpadu</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <style>{`
                    body { 
                        font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; 
                        background: #fafbfc;
                    }
                    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: .5; }
                    }
                    .shadow-card { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }
                    .shadow-card:hover { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); transition: box-shadow 0.2s ease; }
                `}</style>
            </Head>

            <div className="min-h-screen bg-slate-50">
                {/* Mobile Drawer Overlay */}
                {sidebarOpen && (
                    <div className="bg-opacity-30 fixed inset-0 z-40 bg-black backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                <Flex>
                    {/* Desktop Sidebar */}
                    <Box className="sticky top-0 hidden h-screen w-80 lg:block">
                        <SidebarContent />
                    </Box>

                    {/* Mobile Drawer */}
                    <Box
                        className={`fixed top-0 left-0 z-50 h-full w-80 transform transition-transform duration-300 ease-in-out lg:hidden ${
                            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    >
                        <SidebarContent />
                        <IconButton variant="solid" className="absolute top-4 right-4 bg-slate-800 text-white" onClick={() => setSidebarOpen(false)}>
                            <X size={18} />
                        </IconButton>
                    </Box>

                    {/* Main Content */}
                    <Box className="min-h-screen flex-1">
                        {/* Header */}
                        <Box className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
                            <Container size="4" className="py-6">
                                <Flex align="center" justify="between">
                                    <Flex align="center" gap="4">
                                        {/* Mobile Menu Button */}
                                        <IconButton
                                            variant="ghost"
                                            className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"
                                            onClick={() => setSidebarOpen(true)}
                                        >
                                            <Menu size={22} />
                                        </IconButton>

                                        <Box>
                                            <Heading size="8" className="font-bold text-slate-800">
                                                Dashboard
                                            </Heading>
                                            <Text size="3" className="font-medium text-slate-500">
                                                Selamat datang kembali, Admin Desa
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <Flex align="center" gap="4">
                                        <IconButton variant="ghost" className="relative rounded-xl p-2 hover:bg-slate-100">
                                            <Bell size={20} />
                                            <Box className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-red-500"></Box>
                                        </IconButton>
                                        <Separator orientation="vertical" size="2" />
                                        <Flex align="center" gap="3">
                                            <Avatar fallback="AD" size="3" className="bg-emerald-600 shadow-md" />
                                            <Box className="hidden sm:block">
                                                <Text size="3" weight="bold" className="text-slate-800">
                                                    Admin Desa
                                                </Text>
                                                <Text size="2" className="text-slate-500">
                                                    admin@desa.id
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Container>
                        </Box>

                        {/* Main Content Area */}
                        <Container size="4" className="py-8">
                            {/* Dashboard Stats */}
                            <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="6" className="mb-8">
                                {dashboardStats.map((stat, index) => (
                                    <Card key={index} className="shadow-card border-0 bg-white p-6 transition-all duration-200 hover:shadow-lg">
                                        <Flex align="center" justify="between" className="mb-4">
                                            <Box className={`rounded-xl p-3 ${stat.color} shadow-sm`}>
                                                <Box className="text-white">{stat.icon}</Box>
                                            </Box>
                                            <Badge
                                                variant="soft"
                                                className={`${
                                                    stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                } font-semibold`}
                                            >
                                                {stat.change}
                                            </Badge>
                                        </Flex>
                                        <Box>
                                            <Text size="5" weight="bold" className="mb-1 text-slate-800">
                                                {stat.value}
                                            </Text>
                                            <Text size="2" className="font-medium text-slate-500">
                                                {stat.title}
                                            </Text>
                                        </Box>
                                    </Card>
                                ))}
                            </Grid>

                            {/* Search and Add Section */}
                            <Card className="shadow-card mb-8 border-0 bg-white p-6">
                                <Flex direction={{ initial: 'column', sm: 'row' }} gap="4" align={{ sm: 'center' }} justify="between">
                                    <Box className="max-w-md flex-1">
                                        <TextField.Root
                                            placeholder="Cari pengguna, email, atau departemen..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full"
                                            size="3"
                                        >
                                            <TextField.Slot>
                                                <Search size={18} className="text-slate-400" />
                                            </TextField.Slot>
                                        </TextField.Root>
                                    </Box>

                                    <Button size="3" className="shrink-0 bg-emerald-600 font-semibold shadow-sm hover:bg-emerald-700">
                                        <Plus size={18} />
                                        Tambah Pengguna
                                    </Button>
                                </Flex>
                            </Card>

                            {/* Users Grid */}
                            <Box>
                                <Flex align="center" justify="between" className="mb-6">
                                    <Box>
                                        <Heading size="6" className="mb-1 font-bold text-slate-800">
                                            Tim Manajemen Desa
                                        </Heading>
                                        <Text size="3" className="text-slate-500">
                                            {filteredUsers.length} anggota tim ditemukan
                                        </Text>
                                    </Box>
                                </Flex>

                                <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="6">
                                    {filteredUsers.map((user) => (
                                        <Card key={user.id} className="shadow-card border-0 bg-white p-6 transition-all duration-200 hover:shadow-lg">
                                            <Flex align="start" justify="between" className="mb-4">
                                                <Flex align="center" gap="3">
                                                    <Avatar fallback={user.avatar} size="4" className="bg-emerald-600 shadow-md" />
                                                    <Box>
                                                        <Text size="4" weight="bold" className="mb-1 text-slate-800">
                                                            {user.name}
                                                        </Text>
                                                        <Text size="2" className="mb-1 text-slate-500">
                                                            {user.email}
                                                        </Text>
                                                        <Badge variant="soft" className="bg-blue-100 text-xs text-blue-700">
                                                            {user.department}
                                                        </Badge>
                                                    </Box>
                                                </Flex>

                                                <DropdownMenu.Root>
                                                    <DropdownMenu.Trigger>
                                                        <IconButton variant="ghost" size="2" className="hover:bg-slate-100">
                                                            <Settings size={16} />
                                                        </IconButton>
                                                    </DropdownMenu.Trigger>
                                                    <DropdownMenu.Content>
                                                        <DropdownMenu.Item>Lihat Profil</DropdownMenu.Item>
                                                        <DropdownMenu.Item>Edit Data</DropdownMenu.Item>
                                                        <DropdownMenu.Item>Kirim Pesan</DropdownMenu.Item>
                                                        <DropdownMenu.Separator />
                                                        <DropdownMenu.Item color="red">Nonaktifkan</DropdownMenu.Item>
                                                    </DropdownMenu.Content>
                                                </DropdownMenu.Root>
                                            </Flex>

                                            <Separator className="my-4" />

                                            <Flex align="center" justify="between">
                                                <Box>
                                                    <Text size="3" weight="medium" className="mb-1 text-slate-700">
                                                        {user.role}
                                                    </Text>
                                                    <Text size="1" className="text-slate-400">
                                                        Aktif {user.lastActive}
                                                    </Text>
                                                </Box>

                                                <Badge
                                                    variant="soft"
                                                    className={
                                                        user.status === 'active'
                                                            ? 'bg-green-100 font-medium text-green-700'
                                                            : 'bg-red-100 font-medium text-red-700'
                                                    }
                                                >
                                                    {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                                </Badge>
                                            </Flex>
                                        </Card>
                                    ))}
                                </Grid>

                                {filteredUsers.length === 0 && (
                                    <Card className="shadow-card border-0 bg-white p-12 text-center">
                                        <Box className="mb-4">
                                            <Users size={48} className="mx-auto text-slate-300" />
                                        </Box>
                                        <Heading size="4" className="mb-2 text-slate-600">
                                            Tidak ada pengguna ditemukan
                                        </Heading>
                                        <Text size="3" className="text-slate-400">
                                            Coba ubah kata kunci pencarian Anda
                                        </Text>
                                    </Card>
                                )}
                            </Box>
                        </Container>
                    </Box>
                </Flex>
            </div>
        </>
    );
}
