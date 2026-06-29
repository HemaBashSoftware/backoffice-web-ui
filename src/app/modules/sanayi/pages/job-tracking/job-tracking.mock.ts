export interface JobTrackingFirmModel {
    id: number;
    tenantId: string;
    companyName: string;
    taxNo: string;
    phoneNumber: string;
    email: string;
    recordStatus: number; // 1: Aktif, 2: Pasif, 3: Ödenmemiş, 4: Belge Yenileme Bekliyor, 5: Askıya Alındı
    ongoingJobsCount: number;
    weeklyCompletedCount: number;
    totalJobsCount: number;
}

export interface JobHistoryModel {
    id: number;
    firmId: number;
    plate: string;
    jobType: string;
    status: 'Devam Ediyor' | 'Tamamlandı';
    date: Date;
}

export const MOCK_FIRMS: JobTrackingFirmModel[] = [
    {
        id: 1,
        tenantId: 'TNT-101',
        companyName: 'AutoFix Kaporta & Boya',
        taxNo: '12345678901',
        phoneNumber: '+90 555 123 45 67',
        email: 'info@autofix.com',
        recordStatus: 1,
        ongoingJobsCount: 2,
        weeklyCompletedCount: 1,
        totalJobsCount: 3
    },
    {
        id: 2,
        tenantId: 'TNT-102',
        companyName: 'Mega Otomotiv Servisi',
        taxNo: '98765432101',
        phoneNumber: '+90 532 987 65 43',
        email: 'mega@otomotiv.com',
        recordStatus: 1,
        ongoingJobsCount: 1,
        weeklyCompletedCount: 1,
        totalJobsCount: 2
    },
    {
        id: 3,
        tenantId: 'TNT-103',
        companyName: 'Yıldız Egzoz ve Mekanik',
        taxNo: '11223344552',
        phoneNumber: '+90 544 111 22 33',
        email: 'yildiz@egzoz.com',
        recordStatus: 2, // Pasif
        ongoingJobsCount: 0,
        weeklyCompletedCount: 0,
        totalJobsCount: 0
    },
    {
        id: 4,
        tenantId: 'TNT-104',
        companyName: 'Hızlı Lastik Hizmetleri',
        taxNo: '55667788993',
        phoneNumber: '+90 505 777 88 99',
        email: 'hizli@lastik.com',
        recordStatus: 1,
        ongoingJobsCount: 1,
        weeklyCompletedCount: 2,
        totalJobsCount: 3
    }
];

export const MOCK_JOBS: JobHistoryModel[] = [
    // AutoFix jobs
    { id: 1, firmId: 1, plate: '34ABC123', jobType: 'Kaporta Onarımı', status: 'Devam Ediyor', date: new Date('2026-06-02') },
    { id: 2, firmId: 1, plate: '34XYZ789', jobType: 'Pasta Cila', status: 'Devam Ediyor', date: new Date('2026-06-03') },
    { id: 3, firmId: 1, plate: '34DEF456', jobType: 'Boya Koruma', status: 'Tamamlandı', date: new Date('2026-05-30') },
    
    // Mega Otomotiv jobs
    { id: 4, firmId: 2, plate: '06XYZ987', jobType: 'Yağ Değişimi', status: 'Devam Ediyor', date: new Date('2026-06-01') },
    { id: 5, firmId: 2, plate: '06ABC555', jobType: 'Motor Bakımı', status: 'Tamamlandı', date: new Date('2026-05-28') },

    // Hızlı Lastik jobs
    { id: 6, firmId: 4, plate: '35DEF456', jobType: 'Ön Düzen Ayarı', status: 'Devam Ediyor', date: new Date('2026-06-03') },
    { id: 7, firmId: 4, plate: '35GHI789', jobType: 'Lastik Değişimi', status: 'Tamamlandı', date: new Date('2026-06-02') },
    { id: 8, firmId: 4, plate: '35JKL101', jobType: 'Balans Ayarı', status: 'Tamamlandı', date: new Date('2026-05-29') }
];

export function syncFirmCounts() {
    MOCK_FIRMS.forEach(firm => {
        const firmJobs = MOCK_JOBS.filter(j => j.firmId === firm.id);
        firm.ongoingJobsCount = firmJobs.filter(j => j.status === 'Devam Ediyor').length;
        
        // Count weekly completed jobs: completed in the last 7 days (including today)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        firm.weeklyCompletedCount = firmJobs.filter(j => 
            j.status === 'Tamamlandı' && new Date(j.date) >= sevenDaysAgo
        ).length;
        
        firm.totalJobsCount = firmJobs.length;
    });
}
