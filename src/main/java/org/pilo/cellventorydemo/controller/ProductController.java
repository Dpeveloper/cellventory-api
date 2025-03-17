package org.pilo.cellventorydemo.controller;

import org.pilo.cellventorydemo.entities.dtos.ProductDto;
import org.pilo.cellventorydemo.services.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public String home(Model model) {
        model.addAttribute("products", productService.findAll());
        return "index";
    }

    @GetMapping("/all")
    @ResponseBody
    public List<ProductDto> getAllProducts() {
        return productService.findAll();
    }

    @GetMapping("/search")
    @ResponseBody
    public List<ProductDto> search(@RequestParam String name) {
        return productService.findByName(name);
    }

    @PostMapping("/save")
    public ResponseEntity<ProductDto> saveProduct(@RequestBody ProductDto product) {
        ProductDto savedProduct = productService.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Integer id, @RequestBody ProductDto productDto) {
        ProductDto updatedProduct = productService.update(id, productDto);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

}