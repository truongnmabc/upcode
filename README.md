This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

sét lại màu khi đổi app, dark theme và light theme cần đổi của mui và tailwinds.

1. NonNullable: Excludes null and undefined
   NonNullable sẽ giúp bạn loại bỏ null và underfined từ type T.Nó chắc chắn rằng đối tượng được tạo từ type T sẽ không chứa giá trị null và underfined.
   VD:
   type User = { name: string; age?: number | null };
   const userAge: NonNullable<User["age"]> = 30; // No null or undefined
2. Partial:Makes all properties optional
   Hãy giả sử rằng bạn có một interface User chứa các thuộc tính name,age,email nhưng khi updateUser bạn chỉ muốn cập nhật lại một số thuộc tính của User nhưng không phải tất cả.Vậy Partial sẽ giúp bạn tạo đối tượng mà không cần phải cung cấp giá trị cho tất cả các thuộc tính trong đó.Ví dụ:
   interface User { name: string; age: number; email: string; }
   const updateUser = (user: Partial<User>) => ({ ...user, updatedAt: new Date() });
   updateUser({ name: 'John' });
3. Readonly: Enforces immutability
   Trong Typescript, Readonly là một từ khóa được sử dụng để tạo những types bất biến,chắc chắn rằng các thuộc tính hoặc một biến không thể thay đổi một khi nó đã được khởi tạo.Ví dụ:
   const config: Readonly<{ apiUrl: string; retries: number }> = { apiUrl: 'https://api[.]com', retries: 5 };
   config[.]apiUrl = 'https://newapi[.]com'; // Error
4. Mapped Types: Transform existing types dynamically.
   Mapped Types là một phương pháp cho phép bạn tạo những types mới bằng cách chuyển các thuộc tính của một type sẵn có một cách có kiểm soát.Ví dụ:
   type Status = 'loading' | 'success' | 'error';
   type ApiResponse<T> = { [K in Status]: T };
   const response: ApiResponse<string> = { loading: 'Loading...', success: 'Done', error: 'Error' };
5. Optional Tuple Elements: Use variadic tuple types.
   Ở Typescript 3.0 trở về sau,bạn có thể tạo một mảng 3 phần tử nhưng chỉ có một phần tử bắt buộc và 2 phần tử đằng sau có thể được bỏ qua hoặc có giá trị mặc định.Các phần tử optional này được kí hiệu là dấu “?” đằng sau type của element.
   VD:
   type UserTuple = [string, number?, boolean?];
   const user1: UserTuple = ['Rob']; // Only name
6. Union Exhaustiveness: Ensure all cases are handled.
   Cái này mình nghĩ là cho cái trường hợp dùng swich-case,ví dụ:
   type Status = 'open' | 'closed' | 'pending';
   function handleStatus(status: Status) {
   switch (status) {
   case 'open': return 'Opened';
   case 'closed': return 'Closed';
   case 'pending': return 'Pending';
   default: const exhaustiveCheck: never = status; return exhaustiveCheck;
   }
   }
7. Omit:Remove properties from a type
   Omit giúp bạn loại đi một số thuộc tính nào đó từ một kiểu mà bạn không cần đến,giả sử bạn cần tạo một kiểu mới từ một interface cũ và muốn bớt đi một thuộc tính ở một interface sẵn có thì ta sẽ làm như sau.
   interface Todo { title: string; description: string; completed: boolean; }
   type TodoPreview = Omit<Todo, 'description'>;
   //loại bỏ thuộc tính 'description' ra khỏi kiểu TodoPreview
   const todo: TodoPreview = { title: 'Learn TypeScript', completed: false };
8. Type Narrowing: Use in and instanceof to narrow types.
   Giả sử bạn có một biến và bạn muốn kiểm tra xem rằng biến đó có phải thuộc type number | string | boolean gì đó hay không,bạn có thể sử dụng “typeof”.Nếu bạn muốn kiểm tra xem một thuộc tính có tồn tại trong một đối tượng hay không,hãy sử dụng “in”.Nếu bạn muốn check xem một đối tượng có phải là một instance của một class nào đó hay không,hãy sử dụng “instanceof “.Ví dụ:
   function processInput(input: string | number | { title: string }) {
   if (typeof input === 'string') return input.toUpperCase();
   if ('title' in input) return input.title.toUpperCase();
   }
9. Conditional Types: Apply conditional logic.
   Conditional types trong typescript giúp bạn định nghĩa những types dựa trên điều kiện,giống với câu lệnh có điều kiện.Nó cho phép bạn tạo các định nghĩa kiểu linh hoạt và chung chung,làm hàm thích nghi với những types input và tăng cường sự linh hoạt và dễ bảo trì.Ví dụ:
   type IsString<T> = T extends string ? true : false;
   type CheckString = IsString<'Hello'>; // true
10. Literal Types with as const:
    Tính năng này cho phép bạn tạo các kiểu dữ liệu theo nghĩa đen bằng cách thêm tiền tố là const vào giá trị theo nghĩa đen.Ví dụ:
    const COLORS = ['red', 'green', 'blue'] as const;
    type Color = typeof COLORS[number]; // 'red' | 'green' | 'blue'
11. Extract and Exclude: Filter union types.
    Extract tạo ra một type mới bằng cách trích xuất các phần tử từ một kiểu hợp nhất(a union type) có thể gán cho một kiểu được chỉ định.
    Ký hiệu: Extract<T, U>

-   T: The original union type(Kiểu liên hợp ban đầu).
-   U: The type to extract from the union(Kiểu để trích xuất từ liên hợp).
    Ví dụ:
    type AllTypes = string | number | boolean;
    type StringOrNumber = Extract<AllTypes, string | number>;
    // Result: StringOrNumber is `string | number`
    Exclude xây dựng một kiểu mới bằng cách loại trừ các phần tử khỏi kiểu hợp nhất có thể gán cho một kiểu được chỉ định.
    Ví dụ:
    type AllTypes = string | number | boolean;
    type OnlyBoolean = Exclude<AllTypes, string | number>;
    // Result: OnlyBoolean is `boolean`

12. Custom Type Guards
    Custom type Guards là những hàm kiểm tra một giá trị có phải là kiểu được chỉ định hay không.Ví dụ:
    function isString(input: any): input is string { return typeof input === 'string'; }
13. Record: Dynamic object types.
    Record là một chức năng giúp bạn xây dựng một loại đối tượng với tập hợp các keys được chỉ định và các giá trị tương ứng của chúng.
    Ký hiệu: Record<Keys, Type>
    Ví dụ:
    type UserRoles = "admin" | "editor" | "viewer";
    const roles: Record<UserRoles, string> = {
    admin: "Alice",
    editor: "Bob",
    viewer: "Charlie",
    };
14. Index Signatures: Add dynamic properties.
    Index Signatures cho phép bạn định nghĩa type cho object với những tên thuộc tính bất kỳ.Điều này hữu ích khi bạn không biết chính xác nên có những keys nào trong type của bạn.
    type TypeName = {
    [key: KeyType]: ValueType;
    };
     key: The name of the dynamic property (commonly key or index but can be any valid identifier).
     KeyType: The type of the property name. Must be string, number, or symbol.
     ValueType: The type of the property values.
    Ví dụ:
    type Dictionary = {
    [key: string]: string;
    };
    const example: Dictionary = {
    firstName: "Alice",
    lastName: "Smith",
    country: "USA",
    };
15. Never Type: For exhaustive checks.
    Kiểu never(Never Type) thường được sử dụng để đảm bảo rằng tất cả các trường hợp trong một kiểu hợp nhất được xử lý rõ ràng. Nếu một trường hợp bị bỏ sót, TypeScript sẽ đưa ra lỗi biên dịch.Ví dụ:
    function assertNever(value: never): never { throw new Error(`Unexpected: ${value}`); }
16. Optional Chaining:
    Cách này giúp kiểm tra giá trị của một thuộc tính nếu thuộc tính đó không có giá trị thì sẽ lập tức dừng lại và trả về giá trị underfined.Ví dụ:
    const user = { profile: { name: 'John' } };
    const userName = user?.profile?.name; // 'John'
17. Null Coalescing (??)
    Kiểm tra xem giá trị bên trái nếu không có thì lấy giá trị mặc định bên phải
    const input: string | null = null;
    const defaultValue = input ?? 'Default'; // 'Default'
18. ReturnType: Infer function return types.
    Trong TypeScript, tiện ích ReturnType cho phép bạn suy ra và trích xuất kiểu trả về của một kiểu hàm nhất định. Điều này hữu ích khi bạn muốn sử dụng lại kiểu trả về của một hàm mà không cần chỉ định thủ công, đảm bảo tính nhất quán và giảm sự trùng lặp.
    function getUser() { return { name: 'John', age: 30 }; }
    type UserReturn = ReturnType<typeof getUser>;
    //type UserReturn = {name:string,age:number};
19. Generics: Flexible function types.
    Generic trong TypeScript cung cấp một cách để tạo các hàm, lớp hoặc giao diện linh hoạt, có thể tái sử dụng và an toàn về kiểu bằng cách giới thiệu các biến kiểu. Các biến kiểu này hoạt động như các trình giữ chỗ có thể được thay thế bằng các kiểu cụ thể khi mã được sử dụng.Ví dụ:
    function identity<T>(value: T): T { return value; }
    identity<string>('Hello'); // 'Hello'
20. Intersection Types: Combine multiple types.
    Trong TypeScript, Intersection Types là một cách để kết hợp nhiều kiểu thành một. Intersection Types biểu diễn một đối tượng hoặc giá trị đồng thời thỏa mãn tất cả các kiểu kết hợp.
    Cú pháp cho kiểu giao nhau sử dụng toán tử &.
    Ví dụ:
    type Admin = { privileges: string[] };
    type User = { name: string };
    type AdminUser = Admin & User;
