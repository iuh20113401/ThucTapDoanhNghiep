import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllShippingFees,
  addShippingFee,
  updateShippingFee, // Import the update action
} from "../redux/actions/ShippingFeeActions";
import {
  Box,
  Button,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Wrap,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input, // Chakra Input for form
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import AddNewShippingFee from "./AddNewShippingFee"; // Import the component for adding new shipping fees
import formatPrice from "../utils/FormatVietNamCurrency";

const ShippingFeeTab = () => {
  const dispatch = useDispatch();
  const { error, loading, shippingLocations } = useSelector(
    (state) => state.shipping
  );

  const [isModalOpen, setIsModalOpen] = useState(false); // State for adding shipping fee modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for editing shipping fee modal
  const [editingShippingLocation, setEditingShippingLocation] = useState(null); // Track the shipping location being edited
  const [newShippingFee, setNewShippingFee] = useState(""); // State for new shipping fee input

  useEffect(() => {
    dispatch(getAllShippingFees());
  }, [dispatch]);

  // Open the Add New Shipping Fee modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Open the Edit Shipping Fee modal
  const handleOpenEditModal = (shippingLocation) => {
    setEditingShippingLocation(shippingLocation);
    setNewShippingFee(shippingLocation.shippingFee); // Pre-fill the shipping fee
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingShippingLocation(null);
  };

  // Handle form submission for updating the shipping fee
  const handleUpdateShippingFee = () => {
    const { city, districtName } = editingShippingLocation;
    dispatch(updateShippingFee(city, districtName, newShippingFee));
    handleCloseEditModal();
  };

  return (
    <div>
      {loading ? (
        <Wrap justify="center">
          <Stack direction="row" spacing="4">
            <Spinner
              mt="20"
              thickness="2px"
              speed="0.65s"
              emptyColor="gray.200"
              color="cyan.500"
              size="xl"
            />
          </Stack>
        </Wrap>
      ) : (
        <Box>
          {error && (
            <Box color="red.500" textAlign="center">
              Error: {error}
            </Box>
          )}
          <Button onClick={handleOpenModal} colorScheme="teal" mb={4}>
            Add New Shipping Fee
          </Button>

          {!shippingLocations?.length ? (
            <Box textAlign="center" mt="4">
              No shipping locations available.
            </Box>
          ) : (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Tỉnh</Th>
                    <Th>Quận</Th>
                    <Th>Phí vận chuyển</Th>
                    <Th width={"20%"}>Hành động</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {shippingLocations.map((sp) => (
                    <Tr key={sp?._id}>
                      <Td>{sp?.city}</Td>
                      <Td>{sp?.districtName}</Td>
                      <Td>
                        {sp?.shippingFee
                          ? formatPrice(sp?.shippingFee)
                          : formatPrice(sp?.defaultFee)}
                      </Td>
                      <Td className="text-center">
                        <VStack>
                          <Button
                            leftIcon={<EditIcon />}
                            variant="outline"
                            onClick={() => handleOpenEditModal(sp)} // Open Edit modal
                          >
                            Thay đổi giá
                          </Button>
                          <Button leftIcon={<DeleteIcon />} variant="outline">
                            Xóa
                          </Button>
                        </VStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Modal for Adding New Shipping Fee */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Shipping Fee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddNewShippingFee onClose={handleCloseModal} /> {/* Add new fee */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Editing Shipping Fee */}
      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Shipping Fee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingShippingLocation && (
              <FormControl>
                <FormLabel>City: {editingShippingLocation.city}</FormLabel>
                <FormLabel>
                  District: {editingShippingLocation.districtName}
                </FormLabel>
                <Input
                  type="number"
                  value={newShippingFee}
                  onChange={(e) => setNewShippingFee(e.target.value)}
                  placeholder="Enter new shipping fee"
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateShippingFee}>
              Save
            </Button>
            <Button variant="ghost" onClick={handleCloseEditModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ShippingFeeTab;
