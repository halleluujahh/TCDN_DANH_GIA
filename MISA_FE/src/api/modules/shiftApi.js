import BaseApiService from '../baseApi'

class ShiftApi extends BaseApiService {
    constructor() {
        super('/Shift')
    }

    getAllPagination(pageSize, currentPage) {
        return this.get('/all-pagination', {
            pageSize,
            currentPage
        })
    }

    getAllPaginationFilter(data, pageSize = 10, currentPage = 0) {
        return this.post(
            `/all-pagination-filter?pageSize=${pageSize}&currentPage=${currentPage}`,
            data
        )
    }
    saveShift(data) {
        return this.post('/save-shift', data)
    }
    updateStatusActive(ids) {
        const formData = new FormData()

        ids.forEach(id => {
            formData.append('ids', id)
        })
        return this.put('/update-status-active', formData)
    }

    updateStatusInactive(ids) {
        const formData = new FormData()

        ids.forEach(id => {
            formData.append('ids', id)
        })
        return this.put('/update-status-inactive', formData)
    }

    deleteShift(ids) {
        const formData = new FormData()

        ids.forEach(id => {
            formData.append('ids', id)
        })
        return this.delete('/delete', { data: formData })
    }
}

export default new ShiftApi()
