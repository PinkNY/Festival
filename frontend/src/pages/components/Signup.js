import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  FormContainer,
  Title,
  TabList,
  TabButton,
  FormGroup,
  Form,
  Input,
  Label,
  FlexContainer,
  Select,
  Button,
} from "../styles/SignupSt";

const SignUp = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formValues, setFormValues] = useState({
    name: "",
    personalId: "",
    personalPassword: "",
    personalPasswordConfirm: "",
    personalEmail: "",
    gender: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    hostId: "",
    hostPassword: "",
    hostPasswordConfirm: "",
    hostEmail: "",
    hostPhone: "",
    companyName: "",
    representativeName: "",
    businessNumber: "",
  });

  const [errors, setErrors] = useState({}); // 오류 상태 추적
  const navigate = useNavigate();

  const handleInputChange = async (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }));

    // 아이디 중복 확인 추가
    if (id === "personalId" || id === "hostId") {
      const isDuplicate = await checkUserIdAvailability(value);
      if (isDuplicate) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [id]: "이미 존재하는 아이디입니다.",
        }));
      } else {
        setErrors((prevErrors) => {
          const { [id]: removedError, ...restErrors } = prevErrors;
          return restErrors;
        });
      }
    }

    // 비밀번호와 비밀번호 확인의 일치 여부를 실시간으로 검증
    if (id === "personalPassword" || id === "personalPasswordConfirm") {
      validateField("personalPasswordConfirm", id === "personalPasswordConfirm" ? value : formValues.personalPasswordConfirm);
    } else if (id === "hostPassword" || id === "hostPasswordConfirm") {
      validateField("hostPasswordConfirm", id === "hostPasswordConfirm" ? value : formValues.hostPasswordConfirm);
    }

    validateField(id, value);
  };

  // 아이디 중복 여부 확인 함수
  const checkUserIdAvailability = async (userId) => {
    try {
      const response = await axios.get(`/api/check-user-id?user_id=${userId}`);
      return response.data.exists;
    } catch (error) {
      console.error("아이디 중복 확인 중 오류가 발생했습니다.", error);
      return false;
    }
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    // 개인 회원가입 유효성 검사
    if (activeTab === "personal") {
      if (field === "name" && !/^[가-힣]+$/.test(value)) {
        newErrors.name = "이름은 한글로만 입력해 주세요.";
      } else if (field === "name") {
        delete newErrors.name;
      }

      if (field === "personalId" && !/^[a-z0-9]+$/.test(value)) {
        newErrors.personalId = "아이디는 소문자 영어와 숫자만 입력 가능합니다.";
      } else if (field === "personalId") {
        delete newErrors.personalId;
      }

      if (field === "personalPassword" && (!/^[a-z0-9!@#%^&*]+$/.test(value) || value.length < 8)) {
        newErrors.personalPassword = value.length < 8 ? "비밀번호는 8자리 이상 입력해 주세요." : "비밀번호는 소문자 영어, 숫자, 그리고 간단한 기호만 사용 가능합니다.";
      } else if (field === "personalPassword") {
        delete newErrors.personalPassword;
      }

      if (field === "personalPasswordConfirm" && formValues.personalPassword !== value) {
        newErrors.personalPasswordConfirm = "비밀번호가 일치하지 않습니다.";
      } else if (field === "personalPasswordConfirm") {
        delete newErrors.personalPasswordConfirm;
      }

      if (field === "personalEmail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.personalEmail = "올바른 이메일 형식을 입력해 주세요.";
      } else if (field === "personalEmail") {
        delete newErrors.personalEmail;
      }

      if (field === "birthYear" || field === "birthMonth" || field === "birthDay") {
        if (!formValues.birthYear || !formValues.birthMonth || !formValues.birthDay) {
          newErrors.birthDate = "생년월일을 모두 선택해 주세요.";
        } else {
          delete newErrors.birthDate;
        }
      }
    }

    // 주최 회원가입 유효성 검사
    if (activeTab === "host") {
      if (field === "hostId" && !/^[a-z0-9]+$/.test(value)) {
        newErrors.hostId = "아이디는 소문자 영어와 숫자만 입력 가능합니다.";
      } else if (field === "hostId") {
        delete newErrors.hostId;
      }

      if (field === "hostPassword" && (!/^[a-z0-9!@#%^&*]+$/.test(value) || value.length < 8)) {
        newErrors.hostPassword = value.length < 8 ? "비밀번호는 8자리 이상 입력해 주세요." : "비밀번호는 소문자 영어, 숫자, 그리고 간단한 기호만 사용 가능합니다.";
      } else if (field === "hostPassword") {
        delete newErrors.hostPassword;
      }

      if (field === "hostPasswordConfirm" && formValues.hostPassword !== value) {
        newErrors.hostPasswordConfirm = "비밀번호가 일치하지 않습니다.";
      } else if (field === "hostPasswordConfirm") {
        delete newErrors.hostPasswordConfirm;
      }

      if (field === "hostEmail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.hostEmail = "올바른 이메일 형식을 입력해 주세요.";
      } else if (field === "hostEmail") {
        delete newErrors.hostEmail;
      }

      if (field === "hostPhone" && !/^\d{3}-\d{3,4}-\d{4}$/.test(value)) {
        newErrors.hostPhone = "연락처는 올바른 형식(예: 010-1234-5678)으로 입력해 주세요.";
      } else if (field === "hostPhone") {
        delete newErrors.hostPhone;
      }

      if (field === "companyName" && !value) {
        newErrors.companyName = "회사명을 입력해 주세요.";
      } else if (field === "companyName") {
        delete newErrors.companyName;
      }

      if (field === "representativeName" && !value) {
        newErrors.representativeName = "대표자명을 입력해 주세요.";
      } else if (field === "representativeName") {
        delete newErrors.representativeName;
      }

      if (field === "businessNumber" && !/^\d{10}$/.test(value)) {
        newErrors.businessNumber = "사업자 등록번호는 10자리 숫자로 입력해 주세요.";
      } else if (field === "businessNumber") {
        delete newErrors.businessNumber;
      }
    }

    setErrors(newErrors);
  };

  const validate = () => {
    const newErrors = {};

    // 필수 필드 빈 값 확인 (개인 및 주최 회원가입)
    if (activeTab === "personal") {
      if (!formValues.name) newErrors.name = "이름을 입력해 주세요.";
      if (!formValues.personalId) newErrors.personalId = "아이디를 입력해 주세요.";
      if (!formValues.personalPassword) newErrors.personalPassword = "비밀번호를 입력해 주세요.";
      if (!formValues.personalPasswordConfirm) newErrors.personalPasswordConfirm = "비밀번호 확인을 입력해 주세요.";
      if (!formValues.personalEmail) newErrors.personalEmail = "이메일을 입력해 주세요.";
      if (!formValues.birthYear || !formValues.birthMonth || !formValues.birthDay) newErrors.birthDate = "생년월일을 모두 선택해 주세요.";
    } else if (activeTab === "host") {
      if (!formValues.hostId) newErrors.hostId = "아이디를 입력해 주세요.";
      if (!formValues.hostPassword) newErrors.hostPassword = "비밀번호를 입력해 주세요.";
      if (!formValues.hostPasswordConfirm) newErrors.hostPasswordConfirm = "비밀번호 확인을 입력해 주세요.";
      if (!formValues.hostEmail) newErrors.hostEmail = "이메일을 입력해 주세요.";
      if (!formValues.hostPhone) newErrors.hostPhone = "연락처를 입력해 주세요.";
      if (!formValues.companyName) newErrors.companyName = "회사명을 입력해 주세요.";
      if (!formValues.representativeName) newErrors.representativeName = "대표자명을 입력해 주세요.";
      if (!formValues.businessNumber) newErrors.businessNumber = "사업자 등록번호를 입력해 주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        // gender를 'M' 또는 'F'로 변환
        const formattedGender = formValues.gender === "male" ? "M" : "F";
        
        // date_of_birth를 8자리로 변환 (예: 19900101)
        const dateOfBirth = `${formValues.birthYear}${formValues.birthMonth.padStart(2, "0")}${formValues.birthDay.padStart(2, "0")}`;
  
        // 백엔드에 맞는 필드로 매핑된 데이터 생성
        const signupData = {
          username: formValues.personalId || formValues.hostId, // 개인 또는 호스트의 아이디 사용
          password: formValues.personalPassword || formValues.hostPassword, // 개인 또는 호스트의 비밀번호 사용
          name: formValues.name || formValues.representativeName, // 개인의 이름 또는 대표자명 사용
          email: formValues.personalEmail || formValues.hostEmail, // 개인 또는 호스트의 이메일 사용
          gender: formattedGender,
          date_of_birth: dateOfBirth,
        };
  
        // 서버로 데이터 전송
        const response = await axios.post('/api/signup', signupData);
        if (response.status === 200) {
          navigate('/login'); // 성공 시 로그인 페이지로 이동
        }
      } catch (error) {
        console.error("회원가입 중 오류가 발생했습니다.", error);
      }
    }
  };
  
  

  return (
    <Container>
      <FormContainer>
        <Title>회원가입</Title>
        <TabList>
          <TabButton active={activeTab === "personal"} onClick={() => setActiveTab("personal")}>개인 회원가입</TabButton>
          <TabButton active={activeTab === "host"} onClick={() => setActiveTab("host")}>주최 회원가입</TabButton>
        </TabList>
        <Form onSubmit={handleSubmit}>
          {activeTab === "personal" ? (
            <>
              <FormGroup>
                <Label htmlFor="name">이름</Label>
                <Input id="name" value={formValues.name} onChange={handleInputChange}  />
                {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="personalId">아이디</Label>
                <Input id="personalId" value={formValues.personalId} onChange={handleInputChange}  />
                {errors.personalId && <span style={{ color: "red" }}>{errors.personalId}</span>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="personalPassword">비밀번호</Label>
                <Input id="personalPassword" type="password" value={formValues.personalPassword} onChange={handleInputChange}  />
                {errors.personalPassword && <span style={{ color: "red" }}>{errors.personalPassword}</span>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="personalPasswordConfirm">비밀번호 확인</Label>
                <Input id="personalPasswordConfirm" type="password" value={formValues.personalPasswordConfirm} onChange={handleInputChange}  />
                {errors.personalPasswordConfirm && <span style={{ color: "red" }}>{errors.personalPasswordConfirm}</span>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="personalEmail">이메일</Label>
                <Input id="personalEmail" type="email" value={formValues.personalEmail} onChange={handleInputChange}  />
                {errors.personalEmail && <span style={{ color: "red" }}>{errors.personalEmail}</span>}
              </FormGroup>
              <FlexContainer>
                <FormGroup style={{ width: "40%" }}>
                  <Label>성별</Label>
                  <Select id="gender" value={formValues.gender} onChange={handleInputChange} >
                    <option value="">성별 선택</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </Select>
                </FormGroup>
                <FormGroup style={{ width: "90%" }}>
                  <Label>생년월일</Label>
                  <FlexContainer>
                    <Select id="birthYear" value={formValues.birthYear} onChange={handleInputChange} >
                      <option value="">년도</option>
                      {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </Select>
                    <Select id="birthMonth" value={formValues.birthMonth} onChange={handleInputChange} >
                      <option value="">월</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month.toString().padStart(2, "0")}>{month}</option>
                      ))}
                    </Select>
                    <Select id="birthDay" value={formValues.birthDay} onChange={handleInputChange} >
                      <option value="">일</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day.toString().padStart(2, "0")}>{day}</option>
                      ))}
                    </Select>
                  </FlexContainer>
                  {errors.birthDate && <span style={{ color: "red" }}>{errors.birthDate}</span>}
                </FormGroup>
              </FlexContainer>
            </>
          ) : (
            <>
              <FormGroup>
                <Label htmlFor="hostId">아이디</Label>
                <Input id="hostId" value={formValues.hostId} onChange={handleInputChange}  />
                {errors.hostId && <span style={{ color: "red" }}>{errors.hostId}</span>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="hostPassword">비밀번호</Label>
                <Input id="hostPassword" type="password" value={formValues.hostPassword} onChange={handleInputChange}  />
                {errors.hostPassword && <span style={{ color: "red" }}>{errors.hostPassword}</span>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="hostPasswordConfirm">비밀번호 확인</Label>
                <Input id="hostPasswordConfirm" type="password" value={formValues.hostPasswordConfirm} onChange={handleInputChange}  />
                {errors.hostPasswordConfirm && <span style={{ color: "red" }}>{errors.hostPasswordConfirm}</span>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="hostEmail">이메일</Label>
                <Input id="hostEmail" type="email" value={formValues.hostEmail} onChange={handleInputChange}  />
                {errors.hostEmail && <span style={{ color: "red" }}>{errors.hostEmail}</span>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="hostPhone">연락처</Label>
                <Input id="hostPhone" type="tel" value={formValues.hostPhone} onChange={handleInputChange}  />
                {errors.hostPhone && <span style={{ color: "red" }}>{errors.hostPhone}</span>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="companyName">회사명</Label>
                <Input id="companyName" value={formValues.companyName} onChange={handleInputChange}  />
                {errors.companyName && <span style={{ color: "red" }}>{errors.companyName}</span>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="representativeName">대표자명</Label>
                <Input id="representativeName" value={formValues.representativeName} onChange={handleInputChange}  />
                {errors.representativeName && <span style={{ color: "red" }}>{errors.representativeName}</span>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="businessNumber">사업자 등록번호</Label>
                <Input id="businessNumber" value={formValues.businessNumber} onChange={handleInputChange}  />
                {errors.businessNumber && <span style={{ color: "red" }}>{errors.businessNumber}</span>}
              </FormGroup>
            </>
          )}
          <Button type="submit">가입하기</Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default SignUp;
