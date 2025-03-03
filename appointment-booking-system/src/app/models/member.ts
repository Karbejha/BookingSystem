export class Member {
    Id: number = 0
    fullName: string | null = null
    Username: string | null = null
    Password: string | null = null
    Email: string | null = null
    phone: string | null = null
     address: string | null = null

    constructor(id: number, username: string, password: string,FullName : string,Email : string,Address : string,Phone : string) {
        this.Id = id
        this.Username = username
        this.Password = password
        this.fullName = FullName
        this.Email = Email
        this.phone = Phone
        this.address = Address
    }
}