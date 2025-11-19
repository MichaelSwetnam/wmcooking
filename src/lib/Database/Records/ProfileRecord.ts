export default interface ProfileRecord {
    id: string;
    email: string;
    /** First [space] Last */
    name: string;
    is_admin: boolean;
}