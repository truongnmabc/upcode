# ✅ 1️⃣ Build stage: Cài đặt dependencies và build ứng dụng
FROM node:22-alpine AS builder
WORKDIR /app/web

# ✅ 2️⃣ Copy package.json và yarn.lock trước để tối ưu cache Docker
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# ✅ 3️⃣ Copy toàn bộ source code (không copy node_modules từ máy local)
COPY . .

# ✅ 4️⃣ Build ứng dụng Next.js
RUN yarn build


# ✅ 5️⃣ Production stage: Chỉ chứa các file cần thiết để chạy ứng dụng
FROM node:22-alpine AS runner
WORKDIR /app/web

# ✅ 6️⃣ Copy build output từ builder stage
COPY --from=builder /app/web/.next .next
COPY --from=builder /app/web/public public
COPY --from=builder /app/web/package.json package.json

# ✅ 7️⃣ Cài đặt **chỉ dependencies cần thiết** để chạy production
RUN yarn install --production --frozen-lockfile

# ✅ 8️⃣ Thiết lập môi trường production
ENV NODE_ENV=production

# ✅ 9️⃣ Mở cổng ứng dụng
EXPOSE 3000

# ✅ 🔟 Chạy ứng dụng Next.js
CMD ["yarn", "start", "-p", "3000"]
