// No longer directly importing Prisma - using API routes instead
export const serviceService = {
  async getServices() {
    try {
      const response = await fetch('/api/services');
      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Gagal mengambil data layanan',
        };
      }

      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      console.error('Error fetching services:', error);
      return {
        success: false,
        error: 'Gagal mengambil data layanan',
      };
    }
  },

  async getServiceById(id: string) {
    try {
      const response = await fetch(`/api/services/${id}`);
      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Layanan tidak ditemukan',
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error('Error fetching service:', error);
      return {
        success: false,
        error: 'Gagal mengambil detail layanan',
      };
    }
  },

  async getServicesByType(type: string) {
    try {
      const response = await fetch(`/api/services?type=${encodeURIComponent(type)}`);
      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Gagal mengambil layanan berdasarkan tipe',
        };
      }

      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      console.error('Error fetching services by type:', error);
      return {
        success: false,
        error: 'Gagal mengambil layanan berdasarkan tipe',
      };
    }
  },

  async createService(data: {
    name: string;
    description?: string;
    type: string;
    duration?: number;
    price: number;
    is_active?: boolean;
  }) {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error || 'Gagal menambahkan layanan' };
      }

      return { success: true, data: result.data, message: result.message || 'Layanan berhasil ditambahkan' };
    } catch (error) {
      console.error('Error creating service:', error);
      return { success: false, error: 'Gagal menambahkan layanan' };
    }
  },

  async updateService(id: string, data: {
    name?: string;
    description?: string;
    type?: string;
    duration?: number;
    price?: number;
    is_active?: boolean;
  }) {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error || 'Gagal mengupdate layanan' };
      }

      return { success: true, data: result.data, message: result.message || 'Layanan berhasil diupdate' };
    } catch (error) {
      console.error('Error updating service:', error);
      return { success: false, error: 'Gagal mengupdate layanan' };
    }
  },

  async deleteService(id: string) {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error || 'Gagal menghapus layanan' };
      }

      return { success: true, message: result.message || 'Layanan berhasil dihapus' };
    } catch (error) {
      console.error('Error deleting service:', error);
      return { success: false, error: 'Gagal menghapus layanan' };
    }
  },
};
