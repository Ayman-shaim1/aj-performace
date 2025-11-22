import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  Badge,
  Flex,
  SimpleGrid,
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogBody,
  DialogCloseTrigger,
  DialogPositioner,
  CloseButton,
} from "@chakra-ui/react";
import {
  FiBook,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiSearch,
  FiTag,
  FiUpload,
  FiImage,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { brandGold } from "../../theme/colors";
import {
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import {
  getEBooks,
  createEBook,
  updateEBook,
  deleteEBook,
} from "../../services/ebookService";
import {
  uploadImage,
  getImageUrl,
  deleteImage,
} from "../../services/uploadService";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import InputText from "../../components/InputText";

// Table styles constants - Réutilisables pour éviter la redéfinition
const BORDER_COLOR = "#E2E8F0";
const TABLE_STYLES = {
  border: `1px solid ${BORDER_COLOR}`,
  padding: "16px",
  borderCollapse: "collapse",
};

const TABLE_HEADER_STYLES = {
  ...TABLE_STYLES,
  backgroundColor: "#F7FAFC",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "12px",
  textTransform: "uppercase",
  color: "#4A5568",
};

const TABLE_CELL_STYLES = {
  ...TABLE_STYLES,
  color: "#1A202C",
  fontWeight: 500,
};

const TABLE_CELL_EMPTY_STYLES = {
  ...TABLE_STYLES,
};

const TABLE_ROW_HOVER_BG = "#F7FAFC";

// Image styles constants
const IMAGE_STYLES = {
  objectFit: "cover",
  border: TABLE_STYLES.border,
};

const IMAGE_TABLE_STYLES = {
  ...IMAGE_STYLES,
  width: "60px",
  height: "60px",
};

const IMAGE_MOBILE_STYLES = {
  ...IMAGE_STYLES,
  width: "80px",
  height: "80px",
  flexShrink: 0,
};

export default function AdminEBooksPage() {
  // Categories state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalCategoryPages, setTotalCategoryPages] = useState(1);
  const categoryLimit = 25;
  const isFirstCategoryMount = useRef(true);

  // E-books state
  const [ebooks, setEbooks] = useState([]);
  const [ebooksLoading, setEbooksLoading] = useState(true);
  const [ebookForm, setEbookForm] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
    imageFile: null,
    categorie: "",
  });
  const [editingEbook, setEditingEbook] = useState(null);
  const [ebookSearchTerm, setEbookSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEbookModalOpen, setIsEbookModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentEbookPage, setCurrentEbookPage] = useState(1);
  const [totalEbooks, setTotalEbooks] = useState(0);
  const [totalEbookPages, setTotalEbookPages] = useState(1);
  const ebookLimit = 25;
  const isFirstEbookMount = useRef(true);

  // Delete confirmation dialogs state
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] =
    useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleteEbookDialogOpen, setIsDeleteEbookDialogOpen] = useState(false);
  const [ebookToDelete, setEbookToDelete] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const offset = (currentCategoryPage - 1) * categoryLimit;
      const result = await getCategories({
        limit: categoryLimit,
        offset: offset,
        searchTerm: categorySearchTerm,
      });
      setCategories(result.categories);
      setTotalCategories(result.total);
      setTotalCategoryPages(Math.ceil(result.total / categoryLimit));
    } catch (error) {
      showErrorToast("", error.message || "Failed to fetch categories");
      setCategories([]);
      setTotalCategories(0);
      setTotalCategoryPages(1);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch all categories for dropdown
  const fetchAllCategories = async () => {
    try {
      const allCats = await getAllCategories();
      return allCats;
    } catch (error) {
      return [];
    }
  };

  // Fetch e-books
  const fetchEBooks = async () => {
    try {
      setEbooksLoading(true);
      const offset = (currentEbookPage - 1) * ebookLimit;
      const categoryId =
        selectedCategoryFilter === "all" ? null : selectedCategoryFilter;
      const result = await getEBooks({
        limit: ebookLimit,
        offset: offset,
        searchTerm: ebookSearchTerm,
        categoryId,
      });
      setEbooks(result.ebooks);
      setTotalEbooks(result.total);
      setTotalEbookPages(Math.ceil(result.total / ebookLimit));
    } catch (error) {
      showErrorToast("", error.message || "Failed to fetch e-books");
      setEbooks([]);
      setTotalEbooks(0);
      setTotalEbookPages(1);
    } finally {
      setEbooksLoading(false);
    }
  };

  // Fetch categories when page changes
  useEffect(() => {
    fetchCategories();
  }, [currentCategoryPage]);

  // Debounce category search and reset to page 1
  useEffect(() => {
    // Skip on initial mount to avoid double fetch
    if (isFirstCategoryMount.current) {
      isFirstCategoryMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (currentCategoryPage === 1) {
        fetchCategories();
      } else {
        setCurrentCategoryPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [categorySearchTerm]);

  // Fetch e-books when page changes
  useEffect(() => {
    fetchEBooks();
    // Mark that initial mount is complete after first fetch
    if (isFirstEbookMount.current) {
      isFirstEbookMount.current = false;
    }
  }, [currentEbookPage]);

  // Reset ebook page when category filter changes
  useEffect(() => {
    // Skip on initial mount to avoid double fetch with initial ebook fetch
    if (isFirstEbookMount.current) {
      return;
    }
    // If page is already 1, fetch directly. Otherwise, setting page to 1 will trigger fetch.
    if (currentEbookPage === 1) {
      fetchEBooks();
    } else {
      setCurrentEbookPage(1);
    }
  }, [selectedCategoryFilter]);

  // Debounce ebook search and reset to page 1
  useEffect(() => {
    // Skip on initial mount to avoid double fetch
    if (isFirstEbookMount.current) {
      isFirstEbookMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (currentEbookPage === 1) {
        fetchEBooks();
      } else {
        setCurrentEbookPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [ebookSearchTerm]);

  // Category handlers
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.$id, { name: categoryForm.name });
        showSuccessToast("Success", "Category updated successfully");
      } else {
        await createCategory({ name: categoryForm.name });
        showSuccessToast("Success", "Category created successfully");
      }
      setCategoryForm({ name: "" });
      setEditingCategory(null);
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch (error) {
      showErrorToast("", error.message || "Failed to save category");
    }
  };

  const handleCategoryEdit = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name });
    setIsCategoryModalOpen(true);
  };

  const handleCategoryDelete = (category) => {
    setCategoryToDelete(category);
    setIsDeleteCategoryDialogOpen(true);
  };

  const confirmCategoryDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.$id);
      showSuccessToast("Success", "Category deleted successfully");
      setIsDeleteCategoryDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      showErrorToast("", error.message || "Failed to delete category");
    }
  };

  const cancelCategoryDelete = () => {
    setIsDeleteCategoryDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleCategoryCancel = () => {
    setCategoryForm({ name: "" });
    setEditingCategory(null);
    setIsCategoryModalOpen(false);
  };

  // E-book handlers
  const handleEbookImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setEbookForm({
          ...ebookForm,
          imageFile: file,
          image: URL.createObjectURL(file),
        });
      } else {
        showErrorToast("", "Please select a valid image file");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setEbookForm({
        ...ebookForm,
        imageFile: file,
        image: URL.createObjectURL(file),
      });
    } else {
      showErrorToast("", "Please drop a valid image file");
    }
  };

  const handleImageRemove = () => {
    setEbookForm({
      ...ebookForm,
      image: null,
      imageFile: null,
    });
  };

  const handleEbookSubmit = async (e) => {
    e.preventDefault();

    // Validate category
    if (!ebookForm.categorie || ebookForm.categorie.trim() === "") {
      showErrorToast("", "Please select a category");
      return;
    }

    let uploadedImageId = null;
    let oldImageId = null;

    try {
      let imageId = ebookForm.image;

      // If there's a new image file, upload it first
      if (ebookForm.imageFile) {
        setUploadingImage(true);
        uploadedImageId = await uploadImage(ebookForm.imageFile);
        imageId = uploadedImageId;
        setUploadingImage(false);
      }

      if (editingEbook) {
        // If updating and there's a new image, save the old one to delete later
        if (ebookForm.imageFile && editingEbook.image) {
          oldImageId = editingEbook.image;
        }
        await updateEBook(editingEbook.$id, {
          title: ebookForm.title,
          description: ebookForm.description,
          price: ebookForm.price,
          image: imageId,
          categorie: ebookForm.categorie,
        });
        // If update succeeded, delete the old image
        if (oldImageId) {
          try {
            await deleteImage(oldImageId);
          } catch (error) {
            console.error("Failed to delete old image:", error);
          }
        }
        showSuccessToast("Success", "E-book updated successfully");
      } else {
        await createEBook({
          title: ebookForm.title,
          description: ebookForm.description,
          price: ebookForm.price,
          image: imageId,
          categorie: ebookForm.categorie,
        });
        showSuccessToast("Success", "E-book created successfully");
      }
      setEbookForm({
        title: "",
        description: "",
        price: "",
        image: null,
        imageFile: null,
        categorie: "",
      });
      setEditingEbook(null);
      setIsEbookModalOpen(false);
      fetchEBooks();
    } catch (error) {
      setUploadingImage(false);

      // If we uploaded a new image but the e-book creation/update failed, delete the uploaded image
      if (uploadedImageId) {
        try {
          await deleteImage(uploadedImageId);
          console.log("Deleted uploaded image due to e-book creation failure");
        } catch (deleteError) {
          console.error("Failed to delete uploaded image:", deleteError);
        }
      }

      showErrorToast("", error.message, "");
    }
  };

  const handleEbookEdit = (ebook) => {
    setEditingEbook(ebook);
    setEbookForm({
      title: ebook.title,
      description: ebook.description,
      price: ebook.price,
      image: ebook.image,
      imageFile: null,
      categorie: ebook.categorie,
    });
    setIsEbookModalOpen(true);
  };

  const handleEbookDelete = (ebook) => {
    setEbookToDelete(ebook);
    setIsDeleteEbookDialogOpen(true);
  };

  const confirmEbookDelete = async () => {
    if (!ebookToDelete) return;
    try {
      await deleteEBook(ebookToDelete.$id);
      // Delete the associated image
      if (ebookToDelete.image) {
        try {
          await deleteImage(ebookToDelete.image);
        } catch (error) {
          console.error("Failed to delete image:", error);
        }
      }
      showSuccessToast("Success", "E-book deleted successfully");
      setIsDeleteEbookDialogOpen(false);
      setEbookToDelete(null);
      fetchEBooks();
    } catch (error) {
      showErrorToast("", error.message || "Failed to delete e-book");
    }
  };

  const cancelEbookDelete = () => {
    setIsDeleteEbookDialogOpen(false);
    setEbookToDelete(null);
  };

  const handleEbookCancel = () => {
    setEbookForm({
      title: "",
      description: "",
      price: "",
      image: null,
      imageFile: null,
      categorie: "",
    });
    setEditingEbook(null);
    setIsEbookModalOpen(false);
  };

  // Category pagination handlers
  const handleCategoryPreviousPage = () => {
    if (currentCategoryPage > 1) {
      setCurrentCategoryPage(currentCategoryPage - 1);
    }
  };

  const handleCategoryNextPage = () => {
    if (currentCategoryPage < totalCategoryPages) {
      setCurrentCategoryPage(currentCategoryPage + 1);
    }
  };

  // E-book pagination handlers
  const handleEbookPreviousPage = () => {
    if (currentEbookPage > 1) {
      setCurrentEbookPage(currentEbookPage - 1);
    }
  };

  const handleEbookNextPage = () => {
    if (currentEbookPage < totalEbookPages) {
      setCurrentEbookPage(currentEbookPage + 1);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 4, md: 8 }}>
      <Container maxW="7xl" px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 8 }} align="stretch">
          {/* Header */}
          <HStack spacing={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <Box color={brandGold} fontSize={{ base: "2xl", md: "4xl" }}>
              <FiLayers />
            </Box>
            <VStack align="start" spacing={2} flex={1}>
              <Heading
                size={{ base: "lg", md: "xl" }}
                color="gray.900"
                fontWeight="bold"
              >
                E-Book Management System
              </Heading>
              <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                Organize, manage, and control your digital library. Create
                categories, upload e-books with images, set prices, and maintain
                your collection with ease.
              </Text>
            </VStack>
          </HStack>

          {/* Categories Section */}
          <Box
            borderRadius="none"
            border="1px solid"
            borderColor="gray.200"
            bg="white"
            p={{ base: 4, md: 6 }}
          >
            <VStack spacing={6} align="stretch">
              {/* Categories Header */}
              <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "stretch", md: "center" }}
                gap={3}
              >
                <HStack spacing={3}>
                  <Box color={brandGold} fontSize={{ base: "lg", md: "xl" }}>
                    <FiTag />
                  </Box>
                  <Heading size={{ base: "sm", md: "md" }} color="gray.900">
                    Categories
                  </Heading>
                </HStack>
                <Button
                  borderRadius="none"
                  bg={brandGold}
                  color="white"
                  _hover={{ bg: "#B8941F" }}
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({ name: "" });
                    setIsCategoryModalOpen(true);
                  }}
                  size={{ base: "sm", md: "md" }}
                  w={{ base: "full", md: "auto" }}
                >
                  <HStack spacing={1}>
                    <FiPlus />
                    <Text>Add Category</Text>
                  </HStack>
                </Button>
              </Flex>

              {/* Categories Search */}
              <InputText
                id="category-search"
                label=""
                type="text"
                placeholder="Search categories..."
                value={categorySearchTerm}
                onChange={(e) => setCategorySearchTerm(e.target.value)}
              />

              {/* Categories List */}
              {categoriesLoading ? (
                <Flex justify="center" align="center" py={8}>
                  <Spinner size="lg" color={brandGold} thickness="3px" />
                </Flex>
              ) : categories.length === 0 ? (
                <Box p={{ base: 4, md: 6 }} textAlign="center" bg="gray.50">
                  <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                    No categories found
                  </Text>
                </Box>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <Box display={{ base: "block", md: "none" }}>
                    <VStack
                      spacing={0}
                      align="stretch"
                      divider={
                        <Box borderTop="1px solid" borderColor="gray.200" />
                      }
                    >
                      {categories.map((category) => (
                        <Box
                          key={category.$id}
                          p={4}
                          _hover={{ bg: "gray.50" }}
                          transition="background 0.2s"
                        >
                          <Flex justify="space-between" align="center">
                            <Text
                              fontWeight="medium"
                              color="gray.900"
                              fontSize="md"
                            >
                              {category.name}
                            </Text>
                            <HStack spacing={2}>
                              <Button
                                size="sm"
                                borderRadius="none"
                                variant="outline"
                                borderColor="gray.300"
                                onClick={() => handleCategoryEdit(category)}
                              >
                                <FiEdit2 />
                              </Button>
                              <Button
                                size="sm"
                                borderRadius="none"
                                variant="outline"
                                borderColor="red.300"
                                color="red.600"
                                onClick={() => handleCategoryDelete(category)}
                              >
                                <FiTrash2 />
                              </Button>
                            </HStack>
                          </Flex>
                        </Box>
                      ))}
                    </VStack>
                  </Box>

                  {/* Desktop Table View */}
                  <Box display={{ base: "none", md: "block" }} overflowX="auto">
                    <table
                      width="100%"
                      style={{ borderCollapse: TABLE_STYLES.borderCollapse }}
                    >
                      <thead
                        style={{
                          backgroundColor: TABLE_HEADER_STYLES.backgroundColor,
                        }}
                      >
                        <tr>
                          <th style={TABLE_HEADER_STYLES}>Name</th>
                          <th style={TABLE_HEADER_STYLES}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category) => (
                          <tr
                            key={category.$id}
                            style={{
                              transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                TABLE_ROW_HOVER_BG;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                          >
                            <td style={TABLE_CELL_STYLES}>{category.name}</td>
                            <td style={TABLE_CELL_EMPTY_STYLES}>
                              <HStack spacing={2}>
                                <Button
                                  size="sm"
                                  borderRadius="none"
                                  variant="outline"
                                  borderColor="gray.300"
                                  onClick={() => handleCategoryEdit(category)}
                                >
                                  <HStack spacing={1}>
                                    <FiEdit2 />
                                    <Text>Edit</Text>
                                  </HStack>
                                </Button>
                                <Button
                                  size="sm"
                                  borderRadius="none"
                                  variant="outline"
                                  borderColor="red.300"
                                  color="red.600"
                                  onClick={() => handleCategoryDelete(category)}
                                >
                                  <HStack spacing={1}>
                                    <FiTrash2 />
                                    <Text>Delete</Text>
                                  </HStack>
                                </Button>
                              </HStack>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </>
              )}

              {/* Categories Pagination */}
              {totalCategoryPages > 1 && (
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "stretch", md: "center" }}
                  gap={{ base: 3, md: 0 }}
                  p={{ base: 3, md: 4 }}
                  borderTop="1px solid"
                  borderColor="gray.200"
                  bg="gray.50"
                >
                  <Text
                    color="gray.600"
                    fontSize={{ base: "xs", md: "sm" }}
                    textAlign={{ base: "center", md: "left" }}
                  >
                    Showing {(currentCategoryPage - 1) * categoryLimit + 1} to{" "}
                    {Math.min(
                      currentCategoryPage * categoryLimit,
                      totalCategories
                    )}{" "}
                    of {totalCategories} categories
                  </Text>
                  <HStack
                    spacing={2}
                    justify={{ base: "center", md: "flex-end" }}
                    flexWrap="wrap"
                  >
                    <Button
                      onClick={handleCategoryPreviousPage}
                      disabled={currentCategoryPage === 1 || categoriesLoading}
                      borderRadius="none"
                      variant="outline"
                      borderColor="gray.300"
                      color="gray.700"
                      _hover={{
                        bg: "gray.100",
                        borderColor: brandGold,
                        color: brandGold,
                      }}
                      _disabled={{
                        opacity: 0.5,
                        cursor: "not-allowed",
                      }}
                      size={{ base: "sm", md: "sm" }}
                    >
                      <HStack spacing={1}>
                        <FiChevronLeft />
                        <Text display={{ base: "none", sm: "block" }}>
                          Previous
                        </Text>
                      </HStack>
                    </Button>
                    <Text
                      color="gray.600"
                      fontSize={{ base: "xs", md: "sm" }}
                      px={2}
                      whiteSpace="nowrap"
                    >
                      Page {currentCategoryPage} of {totalCategoryPages}
                    </Text>
                    <Button
                      onClick={handleCategoryNextPage}
                      disabled={
                        currentCategoryPage === totalCategoryPages ||
                        categoriesLoading
                      }
                      borderRadius="none"
                      variant="outline"
                      borderColor="gray.300"
                      color="gray.700"
                      _hover={{
                        bg: "gray.100",
                        borderColor: brandGold,
                        color: brandGold,
                      }}
                      _disabled={{
                        opacity: 0.5,
                        cursor: "not-allowed",
                      }}
                      size={{ base: "sm", md: "sm" }}
                    >
                      <HStack spacing={1}>
                        <Text display={{ base: "none", sm: "block" }}>
                          Next
                        </Text>
                        <FiChevronRight />
                      </HStack>
                    </Button>
                  </HStack>
                </Flex>
              )}
            </VStack>
          </Box>

          {/* E-Books Section */}
          <Box
            borderRadius="none"
            border="1px solid"
            borderColor="gray.200"
            bg="white"
            p={{ base: 4, md: 6 }}
          >
            <VStack spacing={6} align="stretch">
              {/* E-Books Header */}
              <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "stretch", md: "center" }}
                gap={3}
              >
                <HStack spacing={3}>
                  <Box color={brandGold} fontSize={{ base: "lg", md: "xl" }}>
                    <FiBook />
                  </Box>
                  <Heading size={{ base: "sm", md: "md" }} color="gray.900">
                    E-Books
                  </Heading>
                </HStack>
                <Button
                  borderRadius="none"
                  bg={brandGold}
                  color="white"
                  _hover={{ bg: "#B8941F" }}
                  onClick={() => {
                    setEditingEbook(null);
                    setEbookForm({
                      title: "",
                      description: "",
                      price: "",
                      image: null,
                      imageFile: null,
                      categorie: "",
                    });
                    setIsEbookModalOpen(true);
                  }}
                  size={{ base: "sm", md: "md" }}
                  w={{ base: "full", md: "auto" }}
                >
                  <HStack spacing={1}>
                    <FiPlus />
                    <Text>Add E-Book</Text>
                  </HStack>
                </Button>
              </Flex>

              {/* Search and Filter */}
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={4}
                align={{ base: "stretch", md: "center" }}
              >
                <Box flex={1}>
                  <InputText
                    id="ebook-search"
                    label=""
                    type="text"
                    placeholder="Search e-books..."
                    value={ebookSearchTerm}
                    onChange={(e) => setEbookSearchTerm(e.target.value)}
                  />
                </Box>
                <Box minW={{ base: "full", md: "200px" }}>
                  <CategorySelect
                    value={selectedCategoryFilter}
                    onChange={setSelectedCategoryFilter}
                    includeAllOption={true}
                  />
                </Box>
              </Flex>

              {/* E-Books List */}
              {ebooksLoading ? (
                <Flex justify="center" align="center" py={12}>
                  <Spinner size="xl" color={brandGold} thickness="3px" />
                </Flex>
              ) : ebooks.length === 0 ? (
                <Box p={{ base: 6, md: 8 }} textAlign="center" bg="gray.50">
                  <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                    No e-books found
                  </Text>
                </Box>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <Box display={{ base: "block", md: "none" }}>
                    <VStack
                      spacing={0}
                      align="stretch"
                      divider={
                        <Box borderTop="1px solid" borderColor="gray.200" />
                      }
                    >
                      {ebooks.map((ebook) => (
                        <Box
                          key={ebook.$id}
                          p={4}
                          _hover={{ bg: "gray.50" }}
                          transition="background 0.2s"
                        >
                          <VStack align="stretch" spacing={3}>
                            <Flex gap={3} align="start">
                              {ebook.image && (
                                <img
                                  src={getImageUrl(ebook.image)}
                                  alt={ebook.title}
                                  style={IMAGE_MOBILE_STYLES}
                                />
                              )}
                              <VStack align="start" spacing={1} flex={1}>
                                <Text
                                  fontWeight="semibold"
                                  color="gray.900"
                                  fontSize="md"
                                >
                                  {ebook.title}
                                </Text>
                                <Text
                                  fontSize="lg"
                                  fontWeight="bold"
                                  color={brandGold}
                                >
                                  ${parseFloat(ebook.price).toFixed(2)}
                                </Text>
                                <CategoryBadge categoryId={ebook.categorie} />
                              </VStack>
                            </Flex>
                            <Text fontSize="sm" color="gray.600" noOfLines={3}>
                              {ebook.description}
                            </Text>
                            <HStack spacing={2} justify="flex-end">
                              <Button
                                size="sm"
                                borderRadius="none"
                                variant="outline"
                                borderColor="gray.300"
                                onClick={() => handleEbookEdit(ebook)}
                                flex={1}
                              >
                                <HStack spacing={1}>
                                  <FiEdit2 />
                                  <Text>Edit</Text>
                                </HStack>
                              </Button>
                              <Button
                                size="sm"
                                borderRadius="none"
                                variant="outline"
                                borderColor="red.300"
                                color="red.600"
                                onClick={() => handleEbookDelete(ebook)}
                                flex={1}
                              >
                                <HStack spacing={1}>
                                  <FiTrash2 />
                                  <Text>Delete</Text>
                                </HStack>
                              </Button>
                            </HStack>
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>

                  {/* Desktop Table View */}
                  <Box display={{ base: "none", md: "block" }} overflowX="auto">
                    <table
                      width="100%"
                      style={{ borderCollapse: TABLE_STYLES.borderCollapse }}
                    >
                      <thead
                        style={{
                          backgroundColor: TABLE_HEADER_STYLES.backgroundColor,
                        }}
                      >
                        <tr>
                          <th style={TABLE_HEADER_STYLES}>Image</th>
                          <th style={TABLE_HEADER_STYLES}>Title</th>
                          {/* <th style={TABLE_HEADER_STYLES}>
                            Description
                          </th> */}
                          <th style={TABLE_HEADER_STYLES}>Price</th>
                          <th style={TABLE_HEADER_STYLES}>Category</th>
                          <th style={TABLE_HEADER_STYLES}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ebooks.map((ebook) => (
                          <tr
                            key={ebook.$id}
                            style={{
                              transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                TABLE_ROW_HOVER_BG;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                          >
                            <td style={TABLE_CELL_EMPTY_STYLES}>
                              {ebook.image && (
                                <img
                                  src={getImageUrl(ebook.image)}
                                  alt={ebook.title}
                                  style={IMAGE_TABLE_STYLES}
                                />
                              )}
                            </td>
                            <td style={TABLE_CELL_STYLES}>{ebook.title}</td>
                            {/* <td style={{...TABLE_CELL_EMPTY_STYLES, color: "#4A5568", maxWidth: "300px"}}>
                              <Text noOfLines={2} fontSize="sm" color="gray.600">
                                {ebook.description}
                              </Text>
                            </td> */}
                            <td
                              style={{ ...TABLE_CELL_STYLES, fontWeight: 600 }}
                            >
                              ${parseFloat(ebook.price).toFixed(2)}
                            </td>
                            <td style={TABLE_CELL_EMPTY_STYLES}>
                              <CategoryBadge categoryId={ebook.categorie} />
                            </td>
                            <td style={TABLE_CELL_EMPTY_STYLES}>
                              <HStack spacing={2}>
                                <Button
                                  size="sm"
                                  borderRadius="none"
                                  variant="outline"
                                  borderColor="gray.300"
                                  onClick={() => handleEbookEdit(ebook)}
                                >
                                  <HStack spacing={1}>
                                    <FiEdit2 />
                                    <Text>Edit</Text>
                                  </HStack>
                                </Button>
                                <Button
                                  size="sm"
                                  borderRadius="none"
                                  variant="outline"
                                  borderColor="red.300"
                                  color="red.600"
                                  onClick={() => handleEbookDelete(ebook)}
                                >
                                  <HStack spacing={1}>
                                    <FiTrash2 />
                                    <Text>Delete</Text>
                                  </HStack>
                                </Button>
                              </HStack>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </>
              )}

              {/* E-Books Pagination */}
              {totalEbookPages > 1 && (
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "stretch", md: "center" }}
                  gap={{ base: 3, md: 0 }}
                  p={{ base: 3, md: 4 }}
                  borderTop="1px solid"
                  borderColor="gray.200"
                  bg="gray.50"
                >
                  <Text
                    color="gray.600"
                    fontSize={{ base: "xs", md: "sm" }}
                    textAlign={{ base: "center", md: "left" }}
                  >
                    Showing {(currentEbookPage - 1) * ebookLimit + 1} to{" "}
                    {Math.min(currentEbookPage * ebookLimit, totalEbooks)} of{" "}
                    {totalEbooks} e-books
                  </Text>
                  <HStack
                    spacing={2}
                    justify={{ base: "center", md: "flex-end" }}
                    flexWrap="wrap"
                  >
                    <Button
                      onClick={handleEbookPreviousPage}
                      disabled={currentEbookPage === 1 || ebooksLoading}
                      borderRadius="none"
                      variant="outline"
                      borderColor="gray.300"
                      color="gray.700"
                      _hover={{
                        bg: "gray.100",
                        borderColor: brandGold,
                        color: brandGold,
                      }}
                      _disabled={{
                        opacity: 0.5,
                        cursor: "not-allowed",
                      }}
                      size={{ base: "sm", md: "sm" }}
                    >
                      <HStack spacing={1}>
                        <FiChevronLeft />
                        <Text display={{ base: "none", sm: "block" }}>
                          Previous
                        </Text>
                      </HStack>
                    </Button>
                    <Text
                      color="gray.600"
                      fontSize={{ base: "xs", md: "sm" }}
                      px={2}
                      whiteSpace="nowrap"
                    >
                      Page {currentEbookPage} of {totalEbookPages}
                    </Text>
                    <Button
                      onClick={handleEbookNextPage}
                      disabled={
                        currentEbookPage === totalEbookPages || ebooksLoading
                      }
                      borderRadius="none"
                      variant="outline"
                      borderColor="gray.300"
                      color="gray.700"
                      _hover={{
                        bg: "gray.100",
                        borderColor: brandGold,
                        color: brandGold,
                      }}
                      _disabled={{
                        opacity: 0.5,
                        cursor: "not-allowed",
                      }}
                      size={{ base: "sm", md: "sm" }}
                    >
                      <HStack spacing={1}>
                        <Text display={{ base: "none", sm: "block" }}>
                          Next
                        </Text>
                        <FiChevronRight />
                      </HStack>
                    </Button>
                  </HStack>
                </Flex>
              )}
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* Category Modal */}
      <DialogRoot
        open={isCategoryModalOpen}
        onOpenChange={({ open }) => {
          if (!open) {
            handleCategoryCancel();
          }
        }}
      >
        <DialogBackdrop bg="blackAlpha.700" />
        <DialogPositioner
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={4}
        >
          <DialogContent
            bg="white"
            borderRadius="none"
            maxW="md"
            w="full"
            position="relative"
            mx={{ base: 4, md: 0 }}
          >
            <DialogCloseTrigger asChild>
              <CloseButton
                borderRadius="full"
                position="absolute"
                top={4}
                right={4}
              />
            </DialogCloseTrigger>
            <DialogBody p={6}>
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="gray.900">
                  {editingCategory ? "Edit Category" : "Create New Category"}
                </Heading>
                <form onSubmit={handleCategorySubmit}>
                  <VStack spacing={4} align="stretch">
                    <InputText
                      id="category-name"
                      name="name"
                      label="Category Name"
                      type="text"
                      placeholder="Enter category name"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm({ name: e.target.value })
                      }
                      isRequired
                      autoFocus
                    />
                    <HStack spacing={2} justify="flex-end">
                      <Button
                        type="button"
                        onClick={handleCategoryCancel}
                        borderRadius="none"
                        variant="outline"
                        borderColor="gray.300"
                      >
                        <HStack spacing={1}>
                          <FiX />
                          <Text>Cancel</Text>
                        </HStack>
                      </Button>
                      <Button
                        type="submit"
                        borderRadius="none"
                        bg={brandGold}
                        color="white"
                        _hover={{ bg: "#B8941F" }}
                      >
                        <HStack spacing={1}>
                          {editingCategory ? <FiSave /> : <FiPlus />}
                          <Text>{editingCategory ? "Update" : "Create"}</Text>
                        </HStack>
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              </VStack>
            </DialogBody>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      {/* E-Book Modal */}
      <DialogRoot
        open={isEbookModalOpen}
        onOpenChange={({ open }) => {
          if (!open) {
            handleEbookCancel();
          }
        }}
      >
        <DialogBackdrop bg="blackAlpha.700" />
        <DialogPositioner
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={4}
        >
          <DialogContent
            bg="white"
            borderRadius="none"
            maxW="2xl"
            w="full"
            maxH="90vh"
            overflowY="auto"
            position="relative"
            mx={{ base: 4, md: 0 }}
          >
            <DialogCloseTrigger asChild>
              <CloseButton
                borderRadius="full"
                position="absolute"
                top={4}
                right={4}
                zIndex={10}
              />
            </DialogCloseTrigger>
            <DialogBody p={6}>
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="gray.900">
                  {editingEbook ? "Edit E-Book" : "Create New E-Book"}
                </Heading>
                <form onSubmit={handleEbookSubmit}>
                  <VStack spacing={4} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <InputText
                        id="ebook-title"
                        name="title"
                        label="Title"
                        type="text"
                        placeholder="Enter e-book title"
                        value={ebookForm.title}
                        onChange={(e) =>
                          setEbookForm({
                            ...ebookForm,
                            title: e.target.value,
                          })
                        }
                        isRequired
                      />
                      <InputText
                        id="ebook-price"
                        name="price"
                        label="Price ($)"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={ebookForm.price}
                        onChange={(e) =>
                          setEbookForm({
                            ...ebookForm,
                            price: e.target.value,
                          })
                        }
                        isRequired
                      />
                    </SimpleGrid>
                    <InputText
                      id="ebook-description"
                      name="description"
                      label="Description"
                      placeholder="Enter e-book description"
                      isTextarea
                      value={ebookForm.description}
                      onChange={(e) =>
                        setEbookForm({
                          ...ebookForm,
                          description: e.target.value,
                        })
                      }
                      isRequired
                    />
                    <Box>
                      <Text
                        as="label"
                        display="block"
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.700"
                        mb={2}
                      >
                        Category *
                      </Text>
                      <CategorySelect
                        value={ebookForm.categorie}
                        onChange={(value) =>
                          setEbookForm({ ...ebookForm, categorie: value })
                        }
                        required
                      />
                    </Box>
                    <Box>
                      <Text
                        as="label"
                        display="block"
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.700"
                        mb={2}
                      >
                        Image *
                      </Text>
                      {ebookForm.image ? (
                        <Box position="relative">
                          <Box
                            border="2px dashed"
                            borderColor={brandGold}
                            borderRadius="none"
                            p={0}
                            bg="gray.50"
                            textAlign="center"
                            position="relative"
                            minH="400px"
                            display="flex"
                            flexDirection="column"
                          >
                            <img
                              src={
                                ebookForm.imageFile
                                  ? ebookForm.image
                                  : getImageUrl(ebookForm.image)
                              }
                              alt="Preview"
                              style={{
                                width: "100%",
                                height: "400px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                            <Box
                              position="absolute"
                              bottom={0}
                              left={0}
                              right={0}
                              bg="rgba(0, 0, 0, 0.7)"
                              p={3}
                            >
                              <HStack spacing={2} justify="center">
                                <Button
                                  size="sm"
                                  borderRadius="none"
                                  bg="white"
                                  color="gray.900"
                                  _hover={{ bg: "gray.100" }}
                                  onClick={() => {
                                    const input =
                                      document.createElement("input");
                                    input.type = "file";
                                    input.accept = "image/*";
                                    input.onchange = handleEbookImageChange;
                                    input.click();
                                  }}
                                >
                                  <HStack spacing={1}>
                                    <FiEdit2 />
                                    <Text>Change</Text>
                                  </HStack>
                                </Button>
                                <Button
                                  size="sm"
                                  borderRadius="none"
                                  bg="red.500"
                                  color="white"
                                  _hover={{ bg: "red.600" }}
                                  onClick={handleImageRemove}
                                >
                                  <HStack spacing={1}>
                                    <FiTrash2 />
                                    <Text>Remove</Text>
                                  </HStack>
                                </Button>
                              </HStack>
                            </Box>
                          </Box>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEbookImageChange}
                            required={!editingEbook}
                            style={{ display: "none" }}
                            id="ebook-image-input"
                          />
                        </Box>
                      ) : (
                        <Box
                          border="2px dashed"
                          borderColor={isDragging ? brandGold : "gray.300"}
                          borderRadius="none"
                          p={8}
                          bg={isDragging ? "gray.50" : "white"}
                          textAlign="center"
                          cursor="pointer"
                          transition="all 0.2s"
                          _hover={{
                            borderColor: brandGold,
                            bg: "gray.50",
                          }}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => {
                            document
                              .getElementById("ebook-image-input-hidden")
                              ?.click();
                          }}
                        >
                          <VStack spacing={3}>
                            <Box
                              color={isDragging ? brandGold : "gray.400"}
                              fontSize="4xl"
                            >
                              {isDragging ? <FiUpload /> : <FiImage />}
                            </Box>
                            <VStack spacing={1}>
                              <Text
                                fontWeight="medium"
                                color={isDragging ? brandGold : "gray.700"}
                              >
                                {isDragging
                                  ? "Drop image here"
                                  : "Click to upload or drag and drop"}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                PNG, JPG, GIF up to 5MB
                              </Text>
                            </VStack>
                          </VStack>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEbookImageChange}
                            required={!editingEbook}
                            style={{ display: "none" }}
                            id="ebook-image-input-hidden"
                          />
                        </Box>
                      )}
                    </Box>
                    <HStack spacing={2} justify="flex-end">
                      <Button
                        type="button"
                        onClick={handleEbookCancel}
                        borderRadius="none"
                        variant="outline"
                        borderColor="gray.300"
                      >
                        <HStack spacing={1}>
                          <FiX />
                          <Text>Cancel</Text>
                        </HStack>
                      </Button>
                      <Button
                        type="submit"
                        borderRadius="none"
                        bg={brandGold}
                        color="white"
                        _hover={{ bg: "#B8941F" }}
                        isLoading={uploadingImage}
                        loadingText="Uploading..."
                      >
                        <HStack spacing={1}>
                          {editingEbook ? <FiSave /> : <FiPlus />}
                          <Text>
                            {editingEbook ? "Update" : "Create"} E-Book
                          </Text>
                        </HStack>
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              </VStack>
            </DialogBody>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      {/* Delete Category Confirmation Dialog */}
      <DialogRoot
        open={isDeleteCategoryDialogOpen}
        onOpenChange={({ open }) => {
          if (!open) {
            cancelCategoryDelete();
          }
        }}
      >
        <DialogBackdrop bg="blackAlpha.700" />
        <DialogPositioner
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={4}
        >
          <DialogContent
            bg="white"
            borderRadius="none"
            maxW="md"
            w="full"
            position="relative"
            mx={{ base: 4, md: 0 }}
          >
            <DialogCloseTrigger asChild>
              <CloseButton
                borderRadius="full"
                position="absolute"
                top={4}
                right={4}
              />
            </DialogCloseTrigger>
            <DialogBody p={6}>
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="gray.900">
                  Delete Category
                </Heading>
                <Text color="gray.600" fontSize="md">
                  Are you sure you want to delete the category{" "}
                  <Text as="span" fontWeight="semibold" color="gray.900">
                    "{categoryToDelete?.name}"
                  </Text>
                  ? This action cannot be undone.
                </Text>
                <HStack spacing={2} justify="flex-end" mt={4}>
                  <Button
                    type="button"
                    onClick={cancelCategoryDelete}
                    borderRadius="none"
                    variant="outline"
                    borderColor="gray.300"
                  >
                    <HStack spacing={1}>
                      <FiX />
                      <Text>Cancel</Text>
                    </HStack>
                  </Button>
                  <Button
                    type="button"
                    onClick={confirmCategoryDelete}
                    borderRadius="none"
                    bg="red.500"
                    color="white"
                    _hover={{ bg: "red.600" }}
                  >
                    <HStack spacing={1}>
                      <FiTrash2 />
                      <Text>Delete</Text>
                    </HStack>
                  </Button>
                </HStack>
              </VStack>
            </DialogBody>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      {/* Delete E-Book Confirmation Dialog */}
      <DialogRoot
        open={isDeleteEbookDialogOpen}
        onOpenChange={({ open }) => {
          if (!open) {
            cancelEbookDelete();
          }
        }}
      >
        <DialogBackdrop bg="blackAlpha.700" />
        <DialogPositioner
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={4}
        >
          <DialogContent
            bg="white"
            borderRadius="none"
            maxW="md"
            w="full"
            position="relative"
            mx={{ base: 4, md: 0 }}
          >
            <DialogCloseTrigger asChild>
              <CloseButton
                borderRadius="full"
                position="absolute"
                top={4}
                right={4}
              />
            </DialogCloseTrigger>
            <DialogBody p={6}>
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="gray.900">
                  Delete E-Book
                </Heading>
                <Text color="gray.600" fontSize="md">
                  Are you sure you want to delete the e-book{" "}
                  <Text as="span" fontWeight="semibold" color="gray.900">
                    "{ebookToDelete?.title}"
                  </Text>
                  ? This action cannot be undone and will also delete the
                  associated image.
                </Text>
                <HStack spacing={2} justify="flex-end" mt={4}>
                  <Button
                    type="button"
                    onClick={cancelEbookDelete}
                    borderRadius="none"
                    variant="outline"
                    borderColor="gray.300"
                  >
                    <HStack spacing={1}>
                      <FiX />
                      <Text>Cancel</Text>
                    </HStack>
                  </Button>
                  <Button
                    type="button"
                    onClick={confirmEbookDelete}
                    borderRadius="none"
                    bg="red.500"
                    color="white"
                    _hover={{ bg: "red.600" }}
                  >
                    <HStack spacing={1}>
                      <FiTrash2 />
                      <Text>Delete</Text>
                    </HStack>
                  </Button>
                </HStack>
              </VStack>
            </DialogBody>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </Box>
  );
}

// Category Select Component
function CategorySelect({
  value,
  onChange,
  required = false,
  includeAllOption = false,
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { getAllCategories } = await import(
          "../../services/categoryService"
        );
        const cats = await getAllCategories();
        setCategories(cats);
      } catch (error) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={loading}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: TABLE_STYLES.border,
        borderRadius: 0,
        fontSize: "16px",
        color: "#000000",
        backgroundColor: "#FFFFFF",
        fontFamily: "inherit",
        WebkitTextFillColor: "#000000",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = brandGold;
        e.target.style.boxShadow = `0 0 7px 1px ${brandGold}`;
        e.target.style.outline = "none";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = BORDER_COLOR;
        e.target.style.boxShadow = "none";
      }}
    >
      {loading ? (
        <option value="">Loading...</option>
      ) : (
        <>
          {!includeAllOption && (
            <option value="" disabled={required}>
              {required ? "Select a category *" : "Select a category"}
            </option>
          )}
          {includeAllOption && <option value="all">All Categories</option>}
          {categories.map((cat) => (
            <option key={cat.$id} value={cat.$id}>
              {cat.name}
            </option>
          ))}
        </>
      )}
    </select>
  );
}

// Category Badge Component
function CategoryBadge({ categoryId }) {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCat = async () => {
      if (!categoryId) return;
      try {
        const { getCategoryById } = await import(
          "../../services/categoryService"
        );
        const cat = await getCategoryById(categoryId);
        setCategory(cat);
      } catch (error) {
        console.error("Failed to fetch category:", error);
      }
    };
    fetchCat();
  }, [categoryId]);

  if (!category) {
    return (
      <Text fontSize="sm" color="gray.500">
        -
      </Text>
    );
  }

  return (
    <Badge
      bg={brandGold}
      color="white"
      borderRadius="none"
      px={2}
      py={1}
      fontSize="xs"
      fontWeight="semibold"
    >
      {category.name}
    </Badge>
  );
}
