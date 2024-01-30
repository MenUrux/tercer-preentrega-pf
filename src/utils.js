import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';

const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


export const buildResponsePaginated = (data, baseUrl = URL_BASE, search = '', sort = '') => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    return {
        status: 'success',
        payload: data.docs.map((doc) => doc.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? `${baseUrl}/products?limit=${data.limit}&page=${data.prevPage}${searchParam}${sort ? `&sort=${sort}` : ''}` : null,
        nextLink: data.hasNextPage ? `${baseUrl}/products?limit=${data.limit}&page=${data.nextPage}${searchParam}${sort ? `&sort=${sort}` : ''}` : null,
    }
}


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);
