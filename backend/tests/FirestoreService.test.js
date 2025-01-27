// backend/tests/FirestoreService.test.js
const { saveUserProfile, getUserProfile, updateUserProfile } = require("../services/FirestoreService");
const { doc, setDoc, getDoc, updateDoc } = require("firebase/firestore");

// Mock Firestore functions
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe("FirestoreService", () => {
  const userId = "testUser123";
  const profileData = { email: "test@example.com", phone: "1234567890", photoURL: "http://example.com/photo.jpg" };
  const updatedData = { phone: "9876543210" };

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  // Test saveUserProfile
  test("saveUserProfile saves data to Firestore", async () => {
    const userDocRef = {}; // Mock document reference
    doc.mockReturnValue(userDocRef); // Mock the doc function

    await saveUserProfile(userId, profileData);

    expect(doc).toHaveBeenCalledWith(expect.any(Object), "users", userId); // Check doc was called with correct args
    expect(setDoc).toHaveBeenCalledWith(userDocRef, profileData, { merge: true }); // Check setDoc was called with correct args
  });

  // Test getUserProfile when document exists
  test("getUserProfile retrieves data from Firestore when document exists", async () => {
    const userDocRef = {};
    const mockDocSnap = { exists: jest.fn().mockReturnValue(true), data: jest.fn().mockReturnValue(profileData) };

    doc.mockReturnValue(userDocRef);
    getDoc.mockResolvedValue(mockDocSnap); // Mock getDoc to return the mocked document snapshot

    const result = await getUserProfile(userId);

    expect(doc).toHaveBeenCalledWith(expect.any(Object), "users", userId); // Check doc was called
    expect(getDoc).toHaveBeenCalledWith(userDocRef); // Check getDoc was called with correct args
    expect(result).toEqual(profileData); // Ensure the returned data matches the mock data
  });

  // Test getUserProfile when document does not exist
  test("getUserProfile returns null when document does not exist", async () => {
    const userDocRef = {};
    const mockDocSnap = { exists: jest.fn().mockReturnValue(false) };

    doc.mockReturnValue(userDocRef);
    getDoc.mockResolvedValue(mockDocSnap);

    const result = await getUserProfile(userId);

    expect(doc).toHaveBeenCalledWith(expect.any(Object), "users", userId);
    expect(getDoc).toHaveBeenCalledWith(userDocRef);
    expect(result).toBeNull(); // Check that null is returned
  });

  // Test updateUserProfile
  test("updateUserProfile updates specific fields in Firestore", async () => {
    const userDocRef = {};
    doc.mockReturnValue(userDocRef);

    await updateUserProfile(userId, updatedData);

    expect(doc).toHaveBeenCalledWith(expect.any(Object), "users", userId); // Check doc was called
    expect(updateDoc).toHaveBeenCalledWith(userDocRef, updatedData); // Check updateDoc was called with correct args
  });
});
