package com.ecommerce.service;

import com.ecommerce.enums.ProductStatus;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProductImportExportService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Export products to Excel
     */
    public byte[] exportProductsToExcel() throws IOException {
        List<Product> products = productRepository.findAll();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Products");

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "Tên sản phẩm", "Mô tả", "Giá", "Giá khuyến mãi", 
                           "Danh mục", "Số lượng", "Trạng thái", "Ảnh"};
        
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Create data rows
        int rowNum = 1;
        for (Product product : products) {
            Row row = sheet.createRow(rowNum++);
            
            row.createCell(0).setCellValue(product.getId());
            row.createCell(1).setCellValue(product.getName());
            row.createCell(2).setCellValue(product.getDescription() != null ? product.getDescription() : "");
            row.createCell(3).setCellValue(product.getPrice() != null ? product.getPrice().doubleValue() : 0);
            row.createCell(4).setCellValue(product.getSalePrice() != null ? product.getSalePrice().doubleValue() : 0);
            row.createCell(5).setCellValue(product.getCategory() != null ? product.getCategory().getName() : "");
            row.createCell(6).setCellValue(product.getStock() != null ? product.getStock() : 0);
            row.createCell(7).setCellValue(product.getStatus().name());
            row.createCell(8).setCellValue(product.getImageUrl() != null ? product.getImageUrl() : "");
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return outputStream.toByteArray();
    }

    /**
     * Import products from Excel
     */
    public List<String> importProductsFromExcel(MultipartFile file) throws IOException {
        List<String> errors = new ArrayList<>();
        List<Product> productsToSave = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            
            // Skip header row (row 0)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                try {
                    // Read data from row
                    String name = getCellValueAsString(row.getCell(1));
                    String description = getCellValueAsString(row.getCell(2));
                    BigDecimal price = getCellValueAsBigDecimal(row.getCell(3));
                    BigDecimal salePrice = getCellValueAsBigDecimal(row.getCell(4));
                    String categoryName = getCellValueAsString(row.getCell(5));
                    Integer stock = getCellValueAsInteger(row.getCell(6));
                    String statusStr = getCellValueAsString(row.getCell(7));
                    String imageUrl = getCellValueAsString(row.getCell(8));

                    // Validate required fields
                    if (name == null || name.trim().isEmpty()) {
                        errors.add("Dòng " + (i + 1) + ": Tên sản phẩm không được để trống");
                        continue;
                    }

                    if (price == null) {
                        errors.add("Dòng " + (i + 1) + ": Giá không hợp lệ");
                        continue;
                    }

                    // Find or create category
                    Category category = null;
                    if (categoryName != null && !categoryName.trim().isEmpty()) {
                        category = categoryRepository.findByName(categoryName);
                        if (category == null) {
                            errors.add("Dòng " + (i + 1) + ": Không tìm thấy danh mục: " + categoryName);
                            continue;
                        }
                    }

                    // Determine status
                    ProductStatus status = ProductStatus.ACTIVE;
                    if (statusStr != null && !statusStr.trim().isEmpty()) {
                        try {
                            status = ProductStatus.valueOf(statusStr.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            status = ProductStatus.ACTIVE;
                        }
                    }
                    
                    // Tự động khóa nếu stock = 0
                    if (stock == null || stock == 0) {
                        status = ProductStatus.INACTIVE;
                    }

                    // Generate slug
                    String slug = generateUniqueSlug(toSlug(name));

                    // Create product
                    Product product = Product.builder()
                            .name(name.trim())
                            .slug(slug)
                            .description(description != null ? description.trim() : null)
                            .price(price)
                            .salePrice(salePrice)
                            .category(category)
                            .stock(stock != null ? stock : 0)
                            .status(status)
                            .imageUrl(imageUrl != null && !imageUrl.trim().isEmpty() ? imageUrl.trim() : null)
                            .build();

                    productsToSave.add(product);

                } catch (Exception e) {
                    errors.add("Dòng " + (i + 1) + ": " + e.getMessage());
                }
            }

            // Save all products
            if (errors.isEmpty() || productsToSave.size() > 0) {
                productRepository.saveAll(productsToSave);
            }

        } catch (Exception e) {
            errors.add("Lỗi đọc file Excel: " + e.getMessage());
        }

        return errors;
    }

    // Helper methods
    private String getCellValueAsString(Cell cell) {
        if (cell == null) return null;
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return null;
        }
    }

    private BigDecimal getCellValueAsBigDecimal(Cell cell) {
        if (cell == null) return null;
        
        try {
            if (cell.getCellType() == CellType.NUMERIC) {
                return BigDecimal.valueOf(cell.getNumericCellValue());
            } else if (cell.getCellType() == CellType.STRING) {
                String value = cell.getStringCellValue().trim();
                if (value.isEmpty()) return null;
                return new BigDecimal(value.replace(",", ""));
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    private Integer getCellValueAsInteger(Cell cell) {
        if (cell == null) return null;
        
        try {
            if (cell.getCellType() == CellType.NUMERIC) {
                return (int) cell.getNumericCellValue();
            } else if (cell.getCellType() == CellType.STRING) {
                String value = cell.getStringCellValue().trim();
                if (value.isEmpty()) return null;
                return Integer.parseInt(value);
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    private String toSlug(String input) {
        if (input == null || input.trim().isEmpty()) return "";
        String noWhiteSpace = input.trim().replaceAll("\\s+", "-");
        String normalized = Normalizer.normalize(noWhiteSpace, Normalizer.Form.NFD);
        return Pattern.compile("[^\\w-]").matcher(normalized).replaceAll("").toLowerCase();
    }

    private String generateUniqueSlug(String baseSlug) {
        String slug = baseSlug;
        int count = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count;
            count++;
        }
        return slug;
    }
}

